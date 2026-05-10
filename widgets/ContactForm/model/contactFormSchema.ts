import * as yup from 'yup'
import { countPhoneDigits } from './formatPhone'

export const contactFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Введите ваше имя')
    .min(2, 'Имя должно содержать минимум 2 символа'),
  phone: yup
    .string()
    .required('Введите номер телефона')
    .test('phone-length', 'Введите корректный номер телефона', (value) => {
      return countPhoneDigits(value ?? '') === 11
    }),
  objectType: yup.string().trim().required('Укажите тип объекта'),
  message: yup
    .string()
    .trim()
    .required('Напишите сообщение')
    .min(10, 'Сообщение должно содержать минимум 10 символов'),
  consent: yup
    .boolean()
    .oneOf([true], 'Необходимо согласиться с политикой конфиденциальности')
    .required(),
})

export type IContactFormValues = yup.InferType<typeof contactFormSchema>
