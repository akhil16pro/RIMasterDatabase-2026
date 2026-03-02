import { useTranslation } from "react-i18next"

export default function useLang() {

    const { i18n } = useTranslation()

    return {
        lang: i18n.language,
    }
}
