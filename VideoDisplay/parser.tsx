export const facebook_parser = (url: string): string => {
  const preg = /<iframe.*src="(.*)" w.*><\/iframe>/
  let results = url.match(preg)
  if (results?.[1]) {
    return results[1]
  }

  const embedpreg = /https:\/\/www.facebook.com\/(.*)\/videos\/(.*)/
  results = url.match(embedpreg)
  if (results?.[1] && results?.[2]) {
    return `https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F${encodeURI(
      results[1]
    )}%2Fvideos%${encodeURI(results[2])}%2F&show_text=false&width=560&t=0"`
  }

  return ''
}

export const youtube_parser = (url: string): string => {
  let regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  let match = url.match(regExp)
  return match && match[7].length === 11 ? match[7] : ''
}
