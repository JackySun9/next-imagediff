import React from 'react';
import ImageDiff from '../../../components/ImageDiff';

interface ScreenshotComparison {
  order: number;
  a: string;
  b: string;
  diff: string;
  urls: string;
}

interface Category {
  [key: string]: ScreenshotComparison[];
}

async function getData(category: string) {
  try {
    const res = await fetch(`https://s3-sj3.corp.adobe.com/milo/screenshots/${category}/results.json`, { cache: 'no-store' });
    if (!res.ok) {
      console.log(`HTTP error! status: ${res.status}`);
      return {};
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return {};
  }
}

async function getTimestamp(category: string) {
  try {
    const res = await fetch(`https://s3-sj3.corp.adobe.com/milo/screenshots/${category}/timestamp.json`, { cache: 'no-store' });
    return await res.json();
  } catch (error) {
    return '';
  }
}

interface PageProps {
  params: {
    category: string;
  };
}

const ImageDiffPage: React.FC<PageProps> = async ({ params }) => {
  const data: Category = await getData(params.category);
  const timestamp = await getTimestamp(params.category);

  return (
    <div>
      <ImageDiff data={data} timestamp={timestamp} />
    </div>
  );
};

export default ImageDiffPage;
