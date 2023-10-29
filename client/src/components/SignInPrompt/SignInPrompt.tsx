import { ReactNode, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { UserContext, UserContextType } from "contexts/User/User.context"
import { SignIn } from "components/Authentication/SignIn"

interface SignInPromptProps {
  children: ReactNode
}

export function SignInPrompt({ children }: SignInPromptProps) {
  const navigate = useNavigate()

  const { get_user_settings } = useContext(UserContext) as UserContextType
  const [intercept, set_intercept] = useState(false)
  useEffect(() => {
    get_user_settings().catch(() => set_intercept(true))
  }, [])

  if (!intercept) return <>{children}</>

  return <SignIn on_sign_in={() => navigate(0)} />
}
