import * as salesService from '../services/salesService.js';

export async function getProspects(req, res, next) {
  try {
    const prospects = await salesService.fetchProspects();
    return res.json({ prospects });
  } catch (err) {
    next(err);
  }
}

export async function createProspect(req, res, next) {
  try {
    const prospect = await salesService.createNewProspect(req.body, req.user.name, req.user.role);
    return res.status(201).json({ status: 'success', prospect });
  } catch (err) {
    next(err);
  }
}

export async function getQuotes(req, res, next) {
  try {
    const quotes = await salesService.fetchQuotes();
    return res.json({ quotes });
  } catch (err) {
    next(err);
  }
}

export async function createQuote(req, res, next) {
  try {
    const quote = await salesService.createNewQuote(req.body);
    return res.status(201).json({ status: 'success', quote });
  } catch (err) {
    next(err);
  }
}
