import { Row, Col, Space, Input } from 'antd';
import Button from 'antd/es/button';
import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { VideoCameraOutlined, CameraOutlined } from '@ant-design/icons';

export default function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [dimensions, setDimensions] = useState({});
  const [videoUrl, setVideoUrl] = useState('');
  const [video, setVideo] = useState('');

  let context;
  if (canvasRef.current) {
    context = canvasRef.current.getContext('2d');
  }

  function getVideoSizeData(videoRef) {
    const ratio = videoRef.current.videoWidth / videoRef.current.videoHeight;
    const w = videoRef.current.videoWidth;
    const h = parseInt(w / ratio, 10);
    return {
      ratio,
      w,
      h,
    };
  }

  useEffect(() => {
    // Add listener when the video is actually available for
    // the browser to be able to check the dimensions of the video.
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', function () {
        const { w, h } = getVideoSizeData(videoRef);

        canvasRef.current.width = w;
        canvasRef.current.height = h;
        setDimensions({ w, h });
      });
    }
  }, []);

  const onSnapshotClick = () => {
    if (context && videoRef.current) {
      context.fillRect(0, 0, dimensions.w, dimensions.h);
      context.drawImage(videoRef.current, 0, 0, dimensions.w, dimensions.h);
    }
  }

  const onDownloadClick = () => {
    const url = canvasRef.current.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = `${video.substring(video.lastIndexOf('/'))}-snapshot.png`;
    link.href = url;
    link.click();
  }

  return (
    <Space direction="vertical" className='container'>
      <Row className='media-col'>
        Video Snapshot <VideoCameraOutlined style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }} />
        <Col span={24} >
          <video
            crossOrigin="anonymous"
            src={video}
            ref={videoRef}
            controls
            height={'450px'}
            width={'100%'}
          />
        </Col>
      </Row>
      <Row>
        <Input addonBefore="Current video URL" onChange={(e) => setVideoUrl(e.target.value)} />
        <Col span={24} style={{ marginTop: '5px' }}>
          <Button type='primary' onClick={() => setVideo(videoUrl)}>Update URL</Button>
          <Button type='primary' onClick={onSnapshotClick}>Take screenshot</Button>
          <Button type='primary' onClick={onDownloadClick}>Download</Button>
        </Col>
      </Row>
      <Row className='media-col'>
        Snapshot Preview <CameraOutlined style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }} />
        <Col span={24} className='media-col'>
          <canvas crossOrigin="anonymous" ref={canvasRef} />
        </Col>
      </Row>
    </Space>
  );
}
