export function user_verification(domain_name: string) {
  const website = `https://www.${domain_name}/`

  return `
  <div
    style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
        'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
        'Helvetica Neue', sans-serif;
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    "
  >
    <div style="margin-left: auto; margin-right: auto; width: 600px">
      <div style="font-size: 36px; margin-bottom: 10px; white-space: nowrap">
        <a
          href="${website}"
          style="color: #102a43; text-underline-offset: 10px"
        >
          Diogenes Health
        </a>
      </div>
      <div style="color: #4a5058; margin-top: 10px">
        <p>
          Thanks for registering with Diogenes Health. We want to make sure it's
          really you. Please enter the code below to verify your e-mail address.
        </p>
        <div
          style="
            background-color: #f2f3f5;
            border: 1px solid #aeb5be;
            border-radius: 6px;
            color: #102a43;
            font-size: 20px;
            padding: 10px;
            text-align: center;
          "
        >
          {####}
        </div>
        <p>This code will expire after 24 hours.</p>
        <p>
          If you don't want to create an account, you can ignore this message.
        </p>
        <p>Thanks,</p>
        <p>The Diogenes Health team</p>
      </div>
    </div>
  </div>
  `
}
