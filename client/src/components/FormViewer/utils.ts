export function download_file(download_url: string) {
  const a = document.createElement("a")
  a.href = download_url
  a.click()
  a.remove()
}
