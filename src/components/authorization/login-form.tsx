import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { InputCode, InputPhone, Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useState } from 'react'
import ApiConnector from '@/utils/ApiConnector'




export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {

  const [loginValid, setLoginValid] = useState<boolean>(false)
  const [sendCaptcha, setSendCaptcha] = useState<boolean>(false)
  const [captchaImage, setCaptchaImage] = useState<string | null>(null)
  const [captchaId, setCaptchaId] = useState<string | null>(null)
  const [sendCode, setSendCode] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [code, setCode] = useState<string>("")

  const api_con = new ApiConnector("auth")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // TODO: Сейчас токен сохраняется в local Storage

    e.preventDefault();

    const form = e.currentTarget;

    const phone = form.elements.namedItem('phone') as HTMLInputElement;
    const captcha = form.elements.namedItem('captcha') as HTMLInputElement | null;
    setLoading(true)
    if (!sendCode) {
      api_con.post("request_code", { "login": phone.value.replace(/\D/g, ""), "captcha_code": captcha?.value, "captcha_id": captchaId }).then(response => {
        toast(response.message);

        if (response.status == "Good") {
          setSendCode(true)
        } else {
          setSendCaptcha(true)
          setCaptchaImage(response.data.url)
          setCaptchaId(response.data.id)
        }
        setLoading(false)
      })
    } else {
      setSendCaptcha(false)
      api_con.post("request_token", { "login": phone.value.replace(/\D/g, ""), "code": code }).then(response => {
        console.log(response)
        toast(response.message);
        if (response.status == "Good") {
          setSendCode(true)
          api_con.refreshToken(response.data.token)
        }
        setLoading(false)
      })
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-center gap-2'>
            <h1 className='text-xl font-bold'>Добро пожаловать</h1>
          </div>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-3'>
              <Label htmlFor='login'>Номер телефона</Label>
              <InputPhone
                id='phone'
                type='phone'
                required
                setLoginValid={setLoginValid}
              />
            </div>
            {sendCaptcha && (
              <div className='grid gap-3'>
                <Label htmlFor='captcha'>Капча</Label>
                <img src={captchaImage ? captchaImage : ""} style={{ width: "100%" }} alt='captcha' />
                <Input
                  id='captcha'
                  type='texts'
                  placeholder='Введите код с картинки'
                ></Input>

              </div>
            )}
            {sendCode && (
              <div className='grid gap-3'>
                <Label htmlFor='login'>Полученный код</Label>
                <InputCode id='code' setCode={setCode} />
              </div>
            )}
            <Button type='submit' className='w-full' disabled={!loginValid || loading}>
              Login
            </Button>
          </div>
        </div>
      </form>
      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        Нажимая «Продолжить», вы соглашаетесь с нашими <a href='#'>Условиями обслуживания</a>{' '}
        и <a href='#'>Политикой конфиденциальности</a>.
      </div>
    </div>
  )
}
