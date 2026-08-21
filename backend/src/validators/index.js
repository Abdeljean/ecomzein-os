import { z } from 'zod';

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0].message });
    }
    req.body = result.data;
    next();
  };
}

// Canonical Business Status Enums
export const UserRoleEnum = z.enum([
  'owner',
  'commercial',
  'confirmation',
  'technician',
  'finance'
], { errorMap: () => ({ message: 'Rôle utilisateur invalide.' }) });

export const ProspectStatusEnum = z.enum([
  'À Contacter',
  'RDV Fixé',
  'Devis Envoyé',
  'Négociation',
  'Gagné',
  'Perdu'
], { errorMap: () => ({ message: 'Statut de prospect invalide.' }) });

export const ClientStatusEnum = z.enum([
  'Actif',
  'Sous Garantie',
  'Inactif',
  'Contentieux'
], { errorMap: () => ({ message: 'Statut client invalide.' }) });

export const QuoteStatusEnum = z.enum([
  'Envoyé',
  'Accepté',
  'Refusé',
  'Expiré'
], { errorMap: () => ({ message: 'Statut de devis invalide.' }) });

export const OrderStatusEnum = z.enum([
  'En Attente',
  'Confirmé',
  'En Préparation',
  'Livré',
  'Annulé'
], { errorMap: () => ({ message: 'Statut de commande invalide.' }) });

export const PaymentStatusEnum = z.enum([
  'Non Payé',
  'Acompte Vérifié',
  'Acompte 50%',
  'Soldé',
  'Partiel',
  'En Retard'
], { errorMap: () => ({ message: 'Statut de paiement invalide.' }) });

export const InstallationStageEnum = z.enum([
  'Planifié',
  'En Cours',
  'Terminé & Validé'
], { errorMap: () => ({ message: 'Étape d\'installation invalide.' }) });

export const WarrantyStatusEnum = z.enum([
  'Actif (12M)',
  'Expiré',
  'Réclamation'
], { errorMap: () => ({ message: 'Statut de garantie invalide.' }) });

export const CommissionStatusEnum = z.enum([
  'En Attente Payout',
  'Payé'
], { errorMap: () => ({ message: 'Statut de commission invalide.' }) });

// Request Schemas
export const loginSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(6, { message: 'Mot de passe de 6 caractères minimum' })
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email({ message: 'Email invalide' })
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, { message: 'Jeton requis' }),
  newPassword: z.string().min(6, { message: 'Mot de passe de 6 caractères minimum' })
});

export const prospectSchema = z.object({
  clinic: z.string().min(2, { message: 'Nom clinique requis' }),
  name: z.string().optional(),
  phone: z.string().min(8, { message: 'Téléphone invalide' }),
  city: z.string().default('Casablanca'),
  pack: z.string().default('Pack Dentaire & TV'),
  status: ProspectStatusEnum.default('À Contacter'),
  value: z.number().nonnegative().default(0),
  salesperson: z.string().optional(),
  notes: z.string().optional()
});

export const confirmOrderSchema = z.object({
  orderId: z.string().min(1, { message: 'ID commande requis' }),
  amountPaid: z.number().nonnegative().default(0)
});

export const validateInstallationSchema = z.object({
  installationId: z.string().min(1, { message: 'ID installation requis' }),
  signedReport: z.boolean().optional().default(true)
});

export const quoteSchema = z.object({
  client: z.string().min(2, { message: 'Nom client requis' }),
  doctor: z.string().optional(),
  pack: z.string().min(2, { message: 'Nom du pack requis' }),
  totalHt: z.number().nonnegative({ message: 'Montant HT valide requis' }),
  tva: z.number().nonnegative({ message: 'TVA valide requise' }),
  totalTtc: z.number().nonnegative({ message: 'Montant TTC valide requis' }),
  status: QuoteStatusEnum.default('Envoyé')
});

export const payoutCommissionSchema = z.object({
  commissionId: z.string().min(1, { message: 'ID commission requis' })
});

