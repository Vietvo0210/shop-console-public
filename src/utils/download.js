export const preformDownload = (blob, filename = null) => {
  const href = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = href
  link.download = filename ?? ''

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(href)
}
