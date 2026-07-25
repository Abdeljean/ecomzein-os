import { prisma } from '../database/prisma.js';
import { logger } from '../logger/index.js';

export async function fetchProspects() {
  return await prisma.prospect.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createNewProspect(data, userName, userRole) {
  const prospect = await prisma.prospect.create({
    data: {
      clinic: data.clinic,
      name: data.name || 'Contact Maître',
      phone: data.phone,
      city: data.city || 'Casablanca',
      pack: data.pack || 'Pack Dentaire & TV',
      value: data.value || 0,
      salesperson: data.salesperson || userName,
      notes: data.notes
    }
  });

  await prisma.auditLog.create({
    data: {
      userName,
      userRole,
      action: 'CREATE_PROSPECT',
      entity: 'Prospect',
      entityId: prospect.id,
      newValue: `Prospect ${data.clinic} créé`
    }
  });

  logger.info('New prospect created', { prospectId: prospect.id, clinic: data.clinic });
  return prospect;
}

export async function fetchQuotes() {
  return await prisma.quote.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createNewQuote(data) {
  const quote = await prisma.quote.create({
    data: {
      client: data.client,
      doctor: data.doctor || '',
      pack: data.pack,
      totalHt: data.totalHt,
      tva: data.tva,
      totalTtc: data.totalTtc
    }
  });
  logger.info('New quote generated', { quoteId: quote.id, client: data.client });
  return quote;
}
