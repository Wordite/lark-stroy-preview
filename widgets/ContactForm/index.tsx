'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Controller, useForm, type ControllerRenderProps } from 'react-hook-form'
import { useContactFormSubmit } from './model/useContactFormSubmit'
import { yupResolver } from '@hookform/resolvers/yup'
import { InputWithLabel } from '@/entities/InputWithLabel'
import { Button } from '@/shared/Button'
import { Checkbox } from '@/shared/Checkbox'
import { Separator } from '@/shared/Separator'
import { SelectDropdown, type ISelectOption } from '@/shared/SelectDropdown'
import StorageIcon from '@/assets/icons/storage.svg'
import LivingIcon from '@/assets/icons/living.svg'
import CommercialIcon from '@/assets/icons/commercial.svg'
import ManufactureIcon from '@/assets/icons/manufacture.svg'
import { contactFormSchema, type IContactFormValues } from './model/contactFormSchema'
import { useContactFormAnimation } from './model/useContactFormAnimation'
import { usePhoneInput } from './model/usePhoneInput'
import { SocialContacts } from '@/entities/SocialContacts'
import { WorkTime } from '@/entities/WorkTime'

const OBJECT_TYPE_OPTIONS: ISelectOption[] = [
  { value: 'storage', label: 'Складской комплекс', Icon: StorageIcon, iconClassName: 'w-[1.375rem] h-[1.188rem]' },
  { value: 'living', label: 'Жилой комплекс', Icon: LivingIcon, iconClassName: 'w-[1.375rem] h-[1.375rem]' },
  { value: 'commercial', label: 'Торговый объект', Icon: CommercialIcon, iconClassName: 'w-[1.375rem] h-[1.375rem]' },
  { value: 'manufacture', label: 'Производственный объект', Icon: ManufactureIcon, iconClassName: 'w-[1.375rem] h-[1.375rem]' },
]

const DEFAULT_VALUES: IContactFormValues = {
  name: '',
  phone: '',
  objectType: '',
  message: '',
  consent: false,
}

interface IPhoneFieldProps {
  field: ControllerRenderProps<IContactFormValues, 'phone'>
  error?: string
}

const PhoneField = ({ field, error }: IPhoneFieldProps) => {
  const phone = usePhoneInput({ value: field.value ?? '', onChange: field.onChange })
  return (
    <InputWithLabel
      label='Телефон*'
      placeholder='+7 (___) ___ - __ - __'
      inputMode='tel'
      autoComplete='tel'
      error={error}
      name={field.name}
      onBlur={field.onBlur}
      ref={phone.ref}
      value={phone.value}
      onChange={phone.onChange}
      onKeyDown={phone.onKeyDown}
    />
  )
}

const ContactForm = () => {
  const {
    sectionRef,
    titleRef,
    formRef,
    sideRef,
    socialContactsRef,
    sideSeparatorRef,
    workTimeRef,
  } = useContactFormAnimation()

  const searchParams = useSearchParams()
  const prefillMessage = searchParams.get('message') ?? ''

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IContactFormValues>({
    resolver: yupResolver(contactFormSchema),
    defaultValues: { ...DEFAULT_VALUES, message: prefillMessage },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    if (prefillMessage) setValue('message', prefillMessage)
  }, [prefillMessage, setValue])

  const { state: submitState, submit } = useContactFormSubmit(() => reset(DEFAULT_VALUES))

  const onSubmit = (values: IContactFormValues) => submit(values)

  return (
    <section ref={sectionRef}>
      <h4
        ref={titleRef}
        className='w-[18.75rem] max-md:w-full mt-[4.375rem] max-md:mt-[2.5rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'
      >
        Оставьте заявку
      </h4>

      <Separator isFullscreen={true} className='mt-[2.5rem]' />

      <div className='flex max-md:flex-col'>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className='flex flex-col gap-[1.688rem] w-[43.75rem] max-md:w-full mt-[1.688rem]'
        >
          <InputWithLabel
            label='Имя*'
            placeholder='Ваше Имя'
            autoComplete='name'
            error={errors.name?.message}
            {...register('name')}
          />

          <Controller
            control={control}
            name='phone'
            render={({ field }) => <PhoneField field={field} error={errors.phone?.message} />}
          />

          <Controller
            control={control}
            name='objectType'
            render={({ field }) => (
              <div>
                <span className='font-semibold text-[1rem] block text-accent'>Тип объекта</span>
                <SelectDropdown
                  options={OBJECT_TYPE_OPTIONS}
                  placeholder='Выберите тип объекта'
                  className='mt-[.5rem]'
                  hasError={Boolean(errors.objectType)}
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                {errors.objectType?.message && (
                  <span className='block mt-[.375rem] text-[.875rem] font-medium text-red-500'>
                    {errors.objectType.message}
                  </span>
                )}
              </div>
            )}
          />

          <InputWithLabel
            asTextarea
            label='Сообщение'
            placeholder='Расскажите о Вашем проекте'
            rows={5}
            error={errors.message?.message}
            {...register('message')}
          />

          <Controller
            control={control}
            name='consent'
            render={({ field }) => (
              <Checkbox
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.consent?.message as string | undefined}
                label={
                  <>
                    Я ознакомлен(а) и согласен(а) с{' '}
                    <a
                      href='/privacy'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-accent underline underline-offset-2'
                    >
                      политикой конфиденциальности
                    </a>{' '}
                    и обработкой персональных данных.
                  </>
                }
              />
            )}
          />

          <Button style='accent' className='self-start'>
            {isSubmitting ? 'Отправка…' : 'Отправить заявку'}
          </Button>
          {submitState === 'success' && (
            <span className='text-green-500 text-[.875rem]'>Спасибо! Мы свяжемся с вами в ближайшее время.</span>
          )}
          {submitState === 'error' && (
            <span className='text-red-500 text-[.875rem]'>Не удалось отправить заявку. Попробуйте позже.</span>
          )}
        </form>

        <div ref={sideRef} className='flex max-md:hidden'>
          <Separator isVertical={true} className='mx-[3.75rem] h-[calc(100%+1.688rem)]' />
        </div>

        <Separator isFullscreen={true} className='hidden max-md:block max-md:mt-[2.5rem]' />

        <div className='flex-1 max-md:mt-[2rem]'>
          <div ref={socialContactsRef}>
            <SocialContacts className='mt-[2.063rem] max-md:mt-0' />
          </div>
          <div ref={sideSeparatorRef}>
            <Separator className='mt-[5.563rem] max-md:mt-[2.5rem] -translate-x-[3.75rem] max-md:-translate-x-(--container-offset) w-[calc(100%+3.75rem+var(--container-offset))] max-md:w-screen' />
          </div>
          <div ref={workTimeRef}>
            <WorkTime className='mt-[5.5rem] max-md:mt-[2.5rem]' />
          </div>
        </div>
      </div>

      <Separator isFullscreen={true} className='mt-[1.688rem]' />
    </section>
  )
}

export { ContactForm }
