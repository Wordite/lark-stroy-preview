'use client'

import { Controller, useForm, type ControllerRenderProps } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { InputWithLabel } from '@/entities/InputWithLabel'
import { Button } from '@/shared/Button'
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
  { value: 'storage', label: 'Складской комплекс', Icon: StorageIcon, iconClassName: 'w-[22px] h-[19px]' },
  { value: 'living', label: 'Жилой комплекс', Icon: LivingIcon, iconClassName: 'w-[22px] h-[22px]' },
  { value: 'commercial', label: 'Торговый объект', Icon: CommercialIcon, iconClassName: 'w-[22px] h-[22px]' },
  { value: 'manufacture', label: 'Производственный объект', Icon: ManufactureIcon, iconClassName: 'w-[22px] h-[22px]' },
]

const DEFAULT_VALUES: IContactFormValues = {
  name: '',
  phone: '',
  objectType: '',
  message: '',
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

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IContactFormValues>({
    resolver: yupResolver(contactFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const onSubmit = async (values: IContactFormValues) => {
    // Stub: integration with the backend goes here.
    console.log('contact form submit', values)
    reset(DEFAULT_VALUES)
  }

  return (
    <section ref={sectionRef}>
      <h4
        ref={titleRef}
        className='w-[300px] mt-[70px] text-[36px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'
      >
        Оставьте заявку
      </h4>

      <Separator isFullscreen={true} className='mt-[40px]' />

      <div className='flex'>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className='flex flex-col gap-[27px] w-[700px] mt-[27px]'
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
                <span className='font-semibold text-[16px] block text-accent'>Тип объекта</span>
                <SelectDropdown
                  options={OBJECT_TYPE_OPTIONS}
                  placeholder='Выберите тип объекта'
                  className='mt-[8px]'
                  hasError={Boolean(errors.objectType)}
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                {errors.objectType?.message && (
                  <span className='block mt-[6px] text-[14px] font-medium text-red-500'>
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

          <Button style='accent' className='self-start'>
            {isSubmitting ? 'Отправка…' : 'Отправить заявку'}
          </Button>
        </form>

        <div ref={sideRef} className='flex'>
          <Separator isVertical={true} className='mx-[60px] h-[calc(100%+27px)]' />
        </div>

        <div className='flex-1'>
          <div ref={socialContactsRef}>
            <SocialContacts className='mt-[33px]' />
          </div>
          <div ref={sideSeparatorRef}>
            <Separator className='mt-[89px] -translate-x-[60px] w-[calc(100%+60px+var(--container-offset))]' />
          </div>
          <div ref={workTimeRef}>
            <WorkTime className='mt-[88px]' />
          </div>
        </div>
      </div>

      <Separator isFullscreen={true} className='mt-[27px]' />
    </section>
  )
}

export { ContactForm }
