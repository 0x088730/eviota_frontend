type VideoEmbedWidgetProps = {
  url?: string;
  title: string;
}

const VideoEmbedWidget = ({ title, url }: VideoEmbedWidgetProps) => {
  if (!url) {
    return (
      <p>No video</p>
    )
  }

  return (
    <iframe
      title={title}
      src={url}
      width='100%'
      height='100%'
      allow='fullscreen'
      style={{ minHeight: '300px' }}
    />
  );
}

export default VideoEmbedWidget