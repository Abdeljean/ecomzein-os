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
  value: z.number().nonnegative().default(0),
  salesperson: z.string().optional(),
  notes: z.string().optional()
});

export const confirmOrderSchema = z.object({
  orderId: z.string().min(1, { message: 'ID commande requis' }),
  amountPaid: z.number().positive({ message: 'Acompte obligatoire (Règle 001)' })
});

export const validateInstallationSchema = z.object({
  installationId: z.string().min(1, { message: 'ID installation requis' }),
  signedReport: z.boolean().refine(val => val === true, { message: 'Rapport PV signé obligatoire (Règle 002)' })
});

export const quoteSchema = z.object({
  client: z.string().min(2, { message: 'Nom client requis' }),
  doctor: z.string().optional(),
  pack: z.string().min(2, { message: 'Nom du pack requis' }),
  totalHt: z.number().nonnegative({ message: 'Montant HT valide requis' }),
  tva: z.number().nonnegative({ message: 'TVA valide requise' }),
  totalTtc: z.number().nonnegative({ message: 'Montant TTC valide requis' })
});

