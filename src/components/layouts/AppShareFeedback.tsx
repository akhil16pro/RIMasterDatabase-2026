import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from "@tanstack/react-form";
import { Check, Copy, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { useEffect,  useState } from "react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  WorkplaceIcon,
  WorkplaceShareButton,
  XIcon,
} from "react-share";
import { DefaultButton } from "../ui/buttons";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";
import { apiClient } from "@/api";
import { useAtomValue } from "jotai";
import { settingsAtom } from "@/routes/__root";

export default function AppShareFeedback({ delay }: { delay: number }) {

  return (
    <motion.div
      className="fixed md:bottom-0 bottom-20 ltr:left-0 rtl:right-0 z-50 p-5 flex flex-col gap-3"
      initial={{ y: 100, opacity: 0, scale: 0.6 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 100, opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.6, delay: delay }}
    >
      <ShareComponent />
      <FeedbackForm />
    </motion.div>
  )
}

function ShareComponent() {

  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);
  const link = 'https://regulatoryintelligence.ae'
  const copyToClipboard = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(link);
  }

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1, opacity: 0.75 }}
          whileTap={{ scale: 0.95, opacity: 0.65 }}
          style={{ opacity: 1, y: 0 }}
          type="button"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary text-text cursor-pointer"
        >
          <Share2 size={20} />
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('share-this-page')}</DialogTitle>
          <DialogDescription>
            {t('share-this-page-description')}
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex items-center justify-between gap-2 mb-2">
          <EmailShareButton url={link} title={import.meta.env.VITE_APP_NAME} className="flex-1 flex items-center justify-center w-full h-auto aspect-square rounded-md overflow-hidden">
            <EmailIcon className="w-full h-full" />
          </EmailShareButton>
          <FacebookShareButton url={link} title={import.meta.env.VITE_APP_NAME} className="flex-1 flex items-center justify-center w-full h-auto aspect-square rounded-md overflow-hidden">
            <FacebookIcon className="w-full h-full" />
          </FacebookShareButton>
          <LinkedinShareButton url={link} title={import.meta.env.VITE_APP_NAME} className="flex-1 flex items-center justify-center w-full h-auto aspect-square rounded-md overflow-hidden">
            <LinkedinIcon className="w-full h-full" />
          </LinkedinShareButton>
          <WorkplaceShareButton url={link} title={import.meta.env.VITE_APP_NAME} className="flex-1 flex items-center justify-center w-full h-auto aspect-square rounded-md overflow-hidden">
            <WorkplaceIcon className="w-full h-full" />
          </WorkplaceShareButton>
          <TelegramShareButton url={link} title={import.meta.env.VITE_APP_NAME} className="flex-1 flex items-center justify-center w-full h-auto aspect-square rounded-md overflow-hidden">
            <TelegramIcon className="w-full h-full" />
          </TelegramShareButton>
          
          <TwitterShareButton url={link} title={import.meta.env.VITE_APP_NAME} className="flex-1 flex items-center justify-center w-full h-auto aspect-square rounded-md overflow-hidden">
            <XIcon className="w-full h-full" />
          </TwitterShareButton>
          <WhatsappShareButton url={link} title={import.meta.env.VITE_APP_NAME} className="flex-1 flex items-center justify-center w-full h-auto aspect-square rounded-md overflow-hidden">
            <WhatsappIcon className="w-full h-full" />
          </WhatsappShareButton>
        </div>

        <div className="w-full flex items-center justify-between border border-text/15 rounded-lg h-12 bg-text/5 overflow-hidden">
         <input readOnly type="text" className="w-full h-full bg-transparent outline-none border-none flex-1 font-secondary text-text px-4 text-lg" value={link}/>
          <div className="relative inline-block p-1 w-12 h-12">
            <motion.button
              whileHover={{ scale: 1.1, opacity: 0.75 }}
              whileTap={{ scale: 0.95, opacity: 0.65 }}
              type="button"
              className="inline-flex items-center justify-center h-full w-auto aspect-square bg-linear-to-br from-primary to-secondary text-text cursor-pointer rounded-md"
              onClick={copyToClipboard}
            >
              {
                isCopied ?
                  <Check size={16} />
                  :
                  <Copy size={16} />
              }

            </motion.button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}

function FeedbackForm() {

  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const settings = useAtomValue(settingsAtom)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      feedback_cat_id: '',
      feedback: '',
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        console.log(value);
        const res = await apiClient.post(i18n.language + '/feedback-submit', {
          json: value
        }).json();
        console.log(res);
        toast.success(t('feedback-submitted-successfully'));
        form.reset();
        setOpen(false);
      } catch (error) {
        console.log(error);
        toast.error(t('feedback-submitted-failed'));
      } finally {
        setIsSubmitting(false);
      }
    },
  })


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <DialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.1, opacity: 0.75 }}
            whileTap={{ scale: 0.95, opacity: 0.65 }}
            style={{ opacity: 1, y: 0 }}
            type="button"
            className="inline-flex items-center justify-center w-10 h-auto  rounded-full bg-linear-to-br from-primary to-secondary text-text cursor-pointer [writing-mode:sideways-lr] px-5"
          >
            {t('feedback')}
          </motion.button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t('share-your-feedback')}</DialogTitle>
            <DialogDescription>
              {t('share-your-feedback-description')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 grid-cols-2">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => 
                  value === "" ? t('name-is-required') : 
                  value?.length < 3 ? t('name-must-be-at-least-3-characters') : 
                  value?.length > 100 ? t('name-must-be-less-than-100-characters') 
                  : undefined,
              }}
              children={(field) => (
                <div className="grid gap-1 col-span-2">
                  <Label>{t('name')}</Label>
                  <Input
                    id="email"
                    name="email"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder={t('your-name')}
                    className="h-12 md:text-lg"
                  />
                  {
                    field.state.meta.errors.length > 0 ?
                      <p className="text-xs text-destructive px-2">{field.state.meta.errors[0]}</p>
                      :
                      null
                  }
                </div>
              )}
            />

            <form.Field
              name="email"
              validators={{
                onSubmit: ({ value }) => 
                  !value ? t('email-required') : 
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? t('email-invalid') : 
                  value?.length > 100 ? t('email-must-be-less-than-100-characters') :
                  null
              }}
              children={(field) => (
                <div className="grid gap-1">
                  <Label>{t('email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder={'example@example.com'}
                    className="h-12 md:text-lg"
                  />
                  {
                    field.state.meta.errors.length > 0 ?
                      <p className="text-xs text-destructive px-2">{field.state.meta.errors[0]}</p>
                      :
                      null
                  }
                </div>
              )}
            />

            <form.Field
              name="feedback_cat_id"
              validators={{
                onChange: ({ value }) => value === "" ? t('feedback-category-required') : undefined,
              }}
              children={(field) => (
                <div className="grid gap-1">
                  <Label >{t('category')}</Label>
                  <Select value={field.state.value} onValueChange={field.handleChange}  dir={i18n.language === "en" ? "ltr" : "rtl"}>
                    <SelectTrigger className="h-12 md:text-lg w-full">
                      <SelectValue  placeholder={t('select-category')} />
                    </SelectTrigger>
                    <SelectContent dir={i18n.language === "en" ? "ltr" : "rtl"} >
                      <SelectGroup >
                        {
                          settings?.feedbackCategory?.map((item: any) => (
                            <SelectItem key={item.id + 'cat-sel'} value={item.id}>{item.title}</SelectItem>
                          ))
                        }

                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {
                    field.state.meta.errors.length > 0 ?
                      <p className="text-xs text-destructive px-2">{field.state.meta.errors[0]}</p>
                      :
                      null
                  }
                </div>
              )}
            />

            <form.Field
              name="feedback"
              validators={{
                onChange: ({ value }) => value === "" ? t('feedback-required') : value?.length < 3 ? t('feedback-must-be-at-least-3-characters') : value?.length > 1000 ? t('feedback-must_be_less_than_1000_characters') : undefined,
              }}
              children={(field) => (
                <div className="grid gap-1 col-span-2">
                  <Label>{t('your-feedback')} <span className="text-xs text-text/50">{field.state.value.length} / 1000</span></Label>
                  <Textarea
                    id="feedback"
                    name="feedback"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder={t('enter-your-message')}
                    className="md:text-lg"
                  />
                  {
                    field.state.meta.errors.length > 0 ?
                      <p className="text-xs text-destructive px-2">{field.state.meta.errors[0]}</p>
                      :
                      null
                  }
                </div>
              )}
            />
          </div>



          <DialogFooter className="sm:justify-start mt-2">
            <DialogClose asChild>
              <DefaultButton type="button" title={t('cancel')} variant="shade" />
            </DialogClose>
            <DefaultButton type="submit" title={t('submit')} onClick={form.handleSubmit} disabled={isSubmitting} isLoading={isSubmitting} />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}