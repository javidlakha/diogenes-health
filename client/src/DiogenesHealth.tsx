import { Helmet } from "react-helmet"

import { APIProvider } from "contexts/API/API.provider"
import { UserProvider } from "contexts/User/User.provider"
import "styles/buttons.css"
import "styles/inputs.css"
import "styles/lists.css"
import "styles/main.css"
import { Router } from "./Router"

export function DiogenesHealth() {
  return (
    <>
      <Helmet>
        <link
          rel="canonical"
          href="https://www.diogeneshealth.com/"
        />
      </Helmet>
      <UserProvider>
        <APIProvider>
          <Router />
        </APIProvider>
      </UserProvider>
    </>
  )
}
