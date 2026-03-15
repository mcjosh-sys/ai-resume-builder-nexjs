import { useRouter } from "next/navigation"

export const useNavigate = () => {
    const router = useRouter()
    return (href: string) => router.push(href)
}