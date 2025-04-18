// This file provides a mock database interface that mimics Prisma's API
// It uses local storage for data persistence

import { 
  userService, 
  jobService, 
  contractService, 
  paymentService, 
  notificationService,
  portfolioService,
  gigService,
  proposalService
} from './mock-data';

// Mock Prisma client that mimics the Prisma API
const db = {
  user: {
    findMany: async (options: any) => {
      const users = await userService.getAll();
      return users;
    },
    findUnique: async (options: any) => {
      const { where } = options;
      return await userService.getById(where.id);
    },
    create: async (options: any) => {
      const { data } = options;
      return await userService.create(data);
    },
    update: async (options: any) => {
      const { where, data } = options;
      return await userService.update(where.id, data);
    },
    delete: async (options: any) => {
      const { where } = options;
      return await userService.delete(where.id);
    },
  },
  job: {
    findMany: async (options: any) => {
      const { where, include, orderBy, skip, take } = options;
      const result = await jobService.getAll(where);
      return result.jobs;
    },
    findUnique: async (options: any) => {
      const { where, include } = options;
      return await jobService.getById(where.id);
    },
    create: async (options: any) => {
      const { data } = options;
      return await jobService.create(data);
    },
    update: async (options: any) => {
      const { where, data } = options;
      return await jobService.update(where.id, data);
    },
    delete: async (options: any) => {
      const { where } = options;
      return await jobService.delete(where.id);
    },
    count: async (options: any) => {
      const { where } = options;
      const result = await jobService.getAll(where);
      return result.pagination.total;
    },
  },
  contract: {
    findMany: async (options: any) => {
      const { where, include, orderBy, skip, take } = options;
      const result = await contractService.getAll(where);
      return result.contracts;
    },
    findUnique: async (options: any) => {
      const { where, include } = options;
      return await contractService.getById(where.id);
    },
    create: async (options: any) => {
      const { data } = options;
      return await contractService.create(data);
    },
    update: async (options: any) => {
      const { where, data } = options;
      return await contractService.update(where.id, data);
    },
    delete: async (options: any) => {
      const { where } = options;
      return await contractService.delete(where.id);
    },
  },
  payment: {
    findMany: async (options: any) => {
      const { where, include, orderBy } = options;
      return await paymentService.getAll(where);
    },
    findFirst: async (options: any) => {
      const { where, include } = options;
      const payments = await paymentService.getAll(where);
      return payments[0] || null;
    },
    create: async (options: any) => {
      const { data } = options;
      return await paymentService.create(data);
    },
    update: async (options: any) => {
      const { where, data } = options;
      return await paymentService.update(where.id, data);
    },
  },
  notification: {
    findMany: async (options: any) => {
      const { where, include, orderBy } = options;
      return await notificationService.getAll(where);
    },
    create: async (options: any) => {
      const { data } = options;
      return await notificationService.create(data);
    },
    update: async (options: any) => {
      const { where, data } = options;
      return await notificationService.markAsRead(where.id);
    },
  },
  portfolio: {
    findUnique: async (options: any) => {
      const { where } = options;
      return await portfolioService.getByUserId(where.userId);
    },
    create: async (options: any) => {
      const { data } = options;
      return await portfolioService.create(data);
    },
    update: async (options: any) => {
      const { where, data } = options;
      return await portfolioService.update(where.userId, data);
    },
  },
  gig: {
    findMany: async (options: any) => {
      const { where, include, orderBy } = options;
      return await gigService.getAll(where);
    },
    findUnique: async (options: any) => {
      const { where, include } = options;
      return await gigService.getById(where.id);
    },
    create: async (options: any) => {
      const { data } = options;
      return await gigService.create(data);
    },
    update: async (options: any) => {
      const { where, data } = options;
      return await gigService.update(where.id, data);
    },
    delete: async (options: any) => {
      const { where } = options;
      return await gigService.delete(where.id);
    },
  },
  proposal: {
    findMany: async (options: any) => {
      const { where, include, orderBy } = options;
      if (where.gigId) {
        return await proposalService.getByGigId(where.gigId);
      } else if (where.userId) {
        return await proposalService.getByUserId(where.userId);
      }
      return [];
    },
    findFirst: async (options: any) => {
      const { where, include } = options;
      if (where.gigId) {
        const proposals = await proposalService.getByGigId(where.gigId);
        return proposals[0] || null;
      } else if (where.userId) {
        const proposals = await proposalService.getByUserId(where.userId);
        return proposals[0] || null;
      }
      return null;
    },
    create: async (options: any) => {
      const { data } = options;
      return await proposalService.create(data);
    },
    update: async (options: any) => {
      const { where, data } = options;
      return await proposalService.update(where.id, data);
    },
    delete: async (options: any) => {
      const { where } = options;
      return await proposalService.delete(where.id);
    },
  },
};

export { db }; 