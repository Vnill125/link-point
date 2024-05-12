import { z } from 'zod';

const CheckoutFormSchema = z.object({
  fullname: z.string().nonempty(),
  zip_code: z.string().nonempty(),
  city: z.string().nonempty(),
  street: z.string().nonempty(),
  phone: z.string().nonempty(),
  card_owner: z.string().nonempty(),
  card_number: z.string().regex(/^\d{16}$/), // 16 cyfr
  card_expiration: z.string().regex(/^\d{2}\/\d{2}$/), // Format MM/RR
  card_cvc: z.string().regex(/^\d{3}$/), // 3 cyfry
});

export default CheckoutFormSchema;
