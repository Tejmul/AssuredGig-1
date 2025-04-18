// Mock data service for frontend-only operation
// This replaces backend API calls with local storage operations

import { 
  getFromStorage, 
  saveToStorage, 
  generateId, 
  getCurrentTimestamp,
  mockDelay
} from './local-storage';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'assuredgig_users',
  JOBS: 'assuredgig_jobs',
  CONTRACTS: 'assuredgig_contracts',
  PROPOSALS: 'assuredgig_proposals',
  PAYMENTS: 'assuredgig_payments',
  NOTIFICATIONS: 'assuredgig_notifications',
  PORTFOLIOS: 'assuredgig_portfolios',
  GIGS: 'assuredgig_gigs',
};

// Default data
const DEFAULT_DATA = {
  users: [
    {
      id: '1',
      name: 'Demo Client',
      email: 'client@example.com',
      image: 'https://ui-avatars.com/api/?name=Demo+Client',
      role: 'CLIENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Demo Freelancer',
      email: 'freelancer@example.com',
      image: 'https://ui-avatars.com/api/?name=Demo+Freelancer',
      role: 'FREELANCER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  jobs: [],
  contracts: [],
  proposals: [],
  payments: [],
  notifications: [],
  portfolios: [],
  gigs: [],
};

// Initialize storage with default data if empty
export function initializeStorage() {
  Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
    const data = getFromStorage(storageKey, []);
    if (data.length === 0) {
      saveToStorage(storageKey, DEFAULT_DATA[key.toLowerCase()]);
    }
  });
}

// User operations
export const userService = {
  getAll: async () => {
    await mockDelay();
    return getFromStorage(STORAGE_KEYS.USERS, []);
  },
  
  getById: async (id: string) => {
    await mockDelay();
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    return users.find(user => user.id === id) || null;
  },
  
  create: async (userData: any) => {
    await mockDelay();
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const newUser = {
      id: generateId(),
      ...userData,
      createdAt: getCurrentTimestamp().toISOString(),
      updatedAt: getCurrentTimestamp().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.USERS, [...users, newUser]);
    return newUser;
  },
  
  update: async (id: string, userData: any) => {
    await mockDelay();
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const updatedUsers = users.map(user => 
      user.id === id 
        ? { ...user, ...userData, updatedAt: getCurrentTimestamp().toISOString() } 
        : user
    );
    saveToStorage(STORAGE_KEYS.USERS, updatedUsers);
    return updatedUsers.find(user => user.id === id) || null;
  },
  
  delete: async (id: string) => {
    await mockDelay();
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const filteredUsers = users.filter(user => user.id !== id);
    saveToStorage(STORAGE_KEYS.USERS, filteredUsers);
    return true;
  },
};

// Job operations
export const jobService = {
  getAll: async (filters = {}) => {
    await mockDelay();
    let jobs = getFromStorage(STORAGE_KEYS.JOBS, []);
    
    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) || 
        job.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.category) {
      jobs = jobs.filter(job => job.category === filters.category);
    }
    
    if (filters.minBudget) {
      jobs = jobs.filter(job => job.budget >= parseFloat(filters.minBudget));
    }
    
    if (filters.maxBudget) {
      jobs = jobs.filter(job => job.budget <= parseFloat(filters.maxBudget));
    }
    
    if (filters.skills) {
      const skills = filters.skills.split(',').map(skill => skill.trim());
      jobs = jobs.filter(job => 
        job.skills.some(skill => skills.includes(skill))
      );
    }
    
    if (filters.isPremium !== undefined) {
      jobs = jobs.filter(job => job.isPremium === (filters.isPremium === 'true'));
    }
    
    // Pagination
    const page = parseInt(filters.page || '1');
    const limit = parseInt(filters.limit || '10');
    const skip = (page - 1) * limit;
    
    const paginatedJobs = jobs.slice(skip, skip + limit);
    
    return {
      jobs: paginatedJobs,
      pagination: {
        total: jobs.length,
        page,
        limit,
        totalPages: Math.ceil(jobs.length / limit),
      },
    };
  },
  
  getById: async (id: string) => {
    await mockDelay();
    const jobs = getFromStorage(STORAGE_KEYS.JOBS, []);
    return jobs.find(job => job.id === id) || null;
  },
  
  create: async (jobData: any) => {
    await mockDelay();
    const jobs = getFromStorage(STORAGE_KEYS.JOBS, []);
    const newJob = {
      id: generateId(),
      ...jobData,
      status: 'OPEN',
      createdAt: getCurrentTimestamp().toISOString(),
      updatedAt: getCurrentTimestamp().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.JOBS, [...jobs, newJob]);
    return newJob;
  },
  
  update: async (id: string, jobData: any) => {
    await mockDelay();
    const jobs = getFromStorage(STORAGE_KEYS.JOBS, []);
    const updatedJobs = jobs.map(job => 
      job.id === id 
        ? { ...job, ...jobData, updatedAt: getCurrentTimestamp().toISOString() } 
        : job
    );
    saveToStorage(STORAGE_KEYS.JOBS, updatedJobs);
    return updatedJobs.find(job => job.id === id) || null;
  },
  
  delete: async (id: string) => {
    await mockDelay();
    const jobs = getFromStorage(STORAGE_KEYS.JOBS, []);
    const filteredJobs = jobs.filter(job => job.id !== id);
    saveToStorage(STORAGE_KEYS.JOBS, filteredJobs);
    return true;
  },
};

// Contract operations
export const contractService = {
  getAll: async (filters = {}) => {
    await mockDelay();
    let contracts = getFromStorage(STORAGE_KEYS.CONTRACTS, []);
    
    // Apply filters
    if (filters.status) {
      contracts = contracts.filter(contract => contract.status === filters.status);
    }
    
    if (filters.clientId) {
      contracts = contracts.filter(contract => contract.clientId === filters.clientId);
    }
    
    if (filters.freelancerId) {
      contracts = contracts.filter(contract => contract.freelancerId === filters.freelancerId);
    }
    
    // Pagination
    const page = parseInt(filters.page || '1');
    const limit = parseInt(filters.limit || '10');
    const skip = (page - 1) * limit;
    
    const paginatedContracts = contracts.slice(skip, skip + limit);
    
    return {
      contracts: paginatedContracts,
      pagination: {
        total: contracts.length,
        page,
        limit,
        totalPages: Math.ceil(contracts.length / limit),
      },
    };
  },
  
  getById: async (id: string) => {
    await mockDelay();
    const contracts = getFromStorage(STORAGE_KEYS.CONTRACTS, []);
    return contracts.find(contract => contract.id === id) || null;
  },
  
  create: async (contractData: any) => {
    await mockDelay();
    const contracts = getFromStorage(STORAGE_KEYS.CONTRACTS, []);
    const newContract = {
      id: generateId(),
      ...contractData,
      status: 'PENDING',
      createdAt: getCurrentTimestamp().toISOString(),
      updatedAt: getCurrentTimestamp().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.CONTRACTS, [...contracts, newContract]);
    return newContract;
  },
  
  update: async (id: string, contractData: any) => {
    await mockDelay();
    const contracts = getFromStorage(STORAGE_KEYS.CONTRACTS, []);
    const updatedContracts = contracts.map(contract => 
      contract.id === id 
        ? { ...contract, ...contractData, updatedAt: getCurrentTimestamp().toISOString() } 
        : contract
    );
    saveToStorage(STORAGE_KEYS.CONTRACTS, updatedContracts);
    return updatedContracts.find(contract => contract.id === id) || null;
  },
  
  delete: async (id: string) => {
    await mockDelay();
    const contracts = getFromStorage(STORAGE_KEYS.CONTRACTS, []);
    const filteredContracts = contracts.filter(contract => contract.id !== id);
    saveToStorage(STORAGE_KEYS.CONTRACTS, filteredContracts);
    return true;
  },
};

// Payment operations
export const paymentService = {
  getAll: async (filters = {}) => {
    await mockDelay();
    let payments = getFromStorage(STORAGE_KEYS.PAYMENTS, []);
    
    // Apply filters
    if (filters.contractId) {
      payments = payments.filter(payment => payment.contractId === filters.contractId);
    }
    
    if (filters.clientId) {
      payments = payments.filter(payment => payment.clientId === filters.clientId);
    }
    
    if (filters.status) {
      payments = payments.filter(payment => payment.status === filters.status);
    }
    
    return payments;
  },
  
  getById: async (id: string) => {
    await mockDelay();
    const payments = getFromStorage(STORAGE_KEYS.PAYMENTS, []);
    return payments.find(payment => payment.id === id) || null;
  },
  
  create: async (paymentData: any) => {
    await mockDelay();
    const payments = getFromStorage(STORAGE_KEYS.PAYMENTS, []);
    const newPayment = {
      id: generateId(),
      ...paymentData,
      status: 'PENDING',
      createdAt: getCurrentTimestamp().toISOString(),
      updatedAt: getCurrentTimestamp().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.PAYMENTS, [...payments, newPayment]);
    return newPayment;
  },
  
  update: async (id: string, paymentData: any) => {
    await mockDelay();
    const payments = getFromStorage(STORAGE_KEYS.PAYMENTS, []);
    const updatedPayments = payments.map(payment => 
      payment.id === id 
        ? { ...payment, ...paymentData, updatedAt: getCurrentTimestamp().toISOString() } 
        : payment
    );
    saveToStorage(STORAGE_KEYS.PAYMENTS, updatedPayments);
    return updatedPayments.find(payment => payment.id === id) || null;
  },
  
  verify: async (orderId: string, paymentId: string, signature: string) => {
    await mockDelay();
    const payments = getFromStorage(STORAGE_KEYS.PAYMENTS, []);
    const payment = payments.find(p => p.orderId === orderId);
    
    if (!payment) {
      return { success: false, error: 'Payment not found' };
    }
    
    // Update payment status
    const updatedPayment = {
      ...payment,
      status: 'COMPLETED',
      paymentId,
      completedAt: getCurrentTimestamp().toISOString(),
      updatedAt: getCurrentTimestamp().toISOString(),
    };
    
    const updatedPayments = payments.map(p => 
      p.id === payment.id ? updatedPayment : p
    );
    
    saveToStorage(STORAGE_KEYS.PAYMENTS, updatedPayments);
    
    // Update contract status if needed
    const contracts = getFromStorage(STORAGE_KEYS.CONTRACTS, []);
    const contract = contracts.find(c => c.id === payment.contractId);
    
    if (contract && contract.status === 'PENDING') {
      const updatedContract = {
        ...contract,
        status: 'ACTIVE',
        updatedAt: getCurrentTimestamp().toISOString(),
      };
      
      const updatedContracts = contracts.map(c => 
        c.id === contract.id ? updatedContract : c
      );
      
      saveToStorage(STORAGE_KEYS.CONTRACTS, updatedContracts);
    }
    
    return { success: true };
  },
};

// Notification operations
export const notificationService = {
  getAll: async (filters = {}) => {
    await mockDelay();
    let notifications = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, []);
    
    // Apply filters
    if (filters.userId) {
      notifications = notifications.filter(notification => notification.userId === filters.userId);
    }
    
    if (filters.unreadOnly === 'true') {
      notifications = notifications.filter(notification => !notification.read);
    }
    
    return notifications;
  },
  
  create: async (notificationData: any) => {
    await mockDelay();
    const notifications = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotification = {
      id: generateId(),
      ...notificationData,
      read: false,
      createdAt: getCurrentTimestamp().toISOString(),
      updatedAt: getCurrentTimestamp().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, [...notifications, newNotification]);
    return newNotification;
  },
  
  markAsRead: async (id: string) => {
    await mockDelay();
    const notifications = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, []);
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true, updatedAt: getCurrentTimestamp().toISOString() } 
        : notification
    );
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
    return updatedNotifications.find(notification => notification.id === id) || null;
  },
};

// Portfolio operations
export const portfolioService = {
  getByUserId: async (userId: string) => {
    await mockDelay();
    const portfolios = getFromStorage(STORAGE_KEYS.PORTFOLIOS, []);
    return portfolios.find(portfolio => portfolio.userId === userId) || null;
  },
  
  create: async (portfolioData: any) => {
    await mockDelay();
    const portfolios = getFromStorage(STORAGE_KEYS.PORTFOLIOS, []);
    const newPortfolio = {
      id: generateId(),
      ...portfolioData,
      createdAt: getCurrentTimestamp().toISOString(),
      updatedAt: getCurrentTimestamp().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.PORTFOLIOS, [...portfolios, newPortfolio]);
    return newPortfolio;
  },
  
  update: async (userId: string, portfolioData: any) => {
    await mockDelay();
    const portfolios = getFromStorage(STORAGE_KEYS.PORTFOLIOS, []);
    const portfolioIndex = portfolios.findIndex(portfolio => portfolio.userId === userId);
    
    if (portfolioIndex === -1) {
      return null;
    }
    
    const updatedPortfolio = {
      ...portfolios[portfolioIndex],
      ...portfolioData,
      updatedAt: getCurrentTimestamp().toISOString(),
    };
    
    portfolios[portfolioIndex] = updatedPortfolio;
    saveToStorage(STORAGE_KEYS.PORTFOLIOS, portfolios);
    
    return updatedPortfolio;
  },
};

// Gig operations
export const gigService = {
  getAll: async (filters = {}) => {
    await mockDelay();
    let gigs = getFromStorage(STORAGE_KEYS.GIGS, []);
    
    // Apply filters
    if (filters.skills) {
      const skills = filters.skills.split(',').map(skill => skill.trim());
      gigs = gigs.filter(gig => 
        JSON.parse(gig.skills).some(skill => skills.includes(skill))
      );
    }
    
    if (filters.status) {
      gigs = gigs.filter(gig => gig.status === filters.status);
    }
    
    return gigs;
  },
  
  getById: async (id: string) => {
    await mockDelay();
    const gigs = getFromStorage(STORAGE_KEYS.GIGS, []);
    return gigs.find(gig => gig.id === id) || null;
  },
  
  create: async (gigData: any) => {
    await mockDelay();
    const gigs = getFromStorage(STORAGE_KEYS.GIGS, []);
    const newGig = {
      id: generateId(),
      ...gigData,
      skills: JSON.stringify(gigData.skills),
      status: 'OPEN',
      createdAt: getCurrentTimestamp().toISOString(),
      updatedAt: getCurrentTimestamp().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.GIGS, [...gigs, newGig]);
    return newGig;
  },
  
  update: async (id: string, gigData: any) => {
    await mockDelay();
    const gigs = getFromStorage(STORAGE_KEYS.GIGS, []);
    const updatedGigs = gigs.map(gig => 
      gig.id === id 
        ? { 
            ...gig, 
            ...gigData, 
            skills: gigData.skills ? JSON.stringify(gigData.skills) : gig.skills,
            updatedAt: getCurrentTimestamp().toISOString() 
          } 
        : gig
    );
    saveToStorage(STORAGE_KEYS.GIGS, updatedGigs);
    return updatedGigs.find(gig => gig.id === id) || null;
  },
  
  delete: async (id: string) => {
    await mockDelay();
    const gigs = getFromStorage(STORAGE_KEYS.GIGS, []);
    const filteredGigs = gigs.filter(gig => gig.id !== id);
    saveToStorage(STORAGE_KEYS.GIGS, filteredGigs);
    return true;
  },
};

// Proposal operations
export const proposalService = {
  getByGigId: async (gigId: string) => {
    await mockDelay();
    const proposals = getFromStorage(STORAGE_KEYS.PROPOSALS, []);
    return proposals.filter(proposal => proposal.gigId === gigId);
  },
  
  getByUserId: async (userId: string) => {
    await mockDelay();
    const proposals = getFromStorage(STORAGE_KEYS.PROPOSALS, []);
    return proposals.filter(proposal => proposal.userId === userId);
  },
  
  create: async (proposalData: any) => {
    await mockDelay();
    const proposals = getFromStorage(STORAGE_KEYS.PROPOSALS, []);
    const newProposal = {
      id: generateId(),
      ...proposalData,
      status: 'PENDING',
      createdAt: getCurrentTimestamp().toISOString(),
      updatedAt: getCurrentTimestamp().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.PROPOSALS, [...proposals, newProposal]);
    return newProposal;
  },
  
  update: async (id: string, proposalData: any) => {
    await mockDelay();
    const proposals = getFromStorage(STORAGE_KEYS.PROPOSALS, []);
    const updatedProposals = proposals.map(proposal => 
      proposal.id === id 
        ? { ...proposal, ...proposalData, updatedAt: getCurrentTimestamp().toISOString() } 
        : proposal
    );
    saveToStorage(STORAGE_KEYS.PROPOSALS, updatedProposals);
    return updatedProposals.find(proposal => proposal.id === id) || null;
  },
  
  delete: async (id: string) => {
    await mockDelay();
    const proposals = getFromStorage(STORAGE_KEYS.PROPOSALS, []);
    const filteredProposals = proposals.filter(proposal => proposal.id !== id);
    saveToStorage(STORAGE_KEYS.PROPOSALS, filteredProposals);
    return true;
  },
};

// Initialize storage on import
if (typeof window !== 'undefined') {
  initializeStorage();
} 