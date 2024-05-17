'use client';
import React, { useState } from 'react';
import { Table, Modal, Button, Tabs, Tab } from 'react-bootstrap';
import Image from 'next/image';
import ReactCompareImage from 'react-compare-image';
import { url } from 'inspector';

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

interface ImageDiffProps {
  data: Category;
  timestamp: string;
}

const HOST = 'https://s3-sj3.corp.adobe.com/milo';

const ImageDiff: React.FC<ImageDiffProps> = ({ data, timestamp }) => {
    const [show, setShow] = useState(false);
    const [leftImage, setLeftImage] = useState('');
    const [rightImage, setRightImage] = useState('');
  
    const handleClose = () => setShow(false);
    const handleShow = (leftImg: string, rightImg: string) => {
        setLeftImage(leftImg);
        setRightImage(rightImg);
        setShow(true);
    };

    const groupByCategorySegment = (data: Category) => {
        return Object.entries(data).reduce((acc: { [key: string]: any[] }, [category, comparisons]) => {
            const segment = category.split('-')[category.split('-').length-1].trim(); // Get the second segment
            if (!acc[segment]) {
                acc[segment] = [];
            }
            acc[segment].push({ category, comparisons });
            return acc;
        }, {});
    };

    // Group data
    const groupedData = groupByCategorySegment(data);
  
    return (
        <div>
          <div className='text-xl m-3 text-blue-600'>Report Time: { timestamp }</div>
          <div className='text-lg m-3  text-red-600'>Notes: no diff means the same, no image means not exist</div>
        <Tabs defaultActiveKey={Object.keys(groupedData)[0]} className="mb-3">
      {Object.entries(groupedData).map(([segment, items], idx) => (
        <Tab eventKey={`tab-${segment}`} title={segment} key={idx}>
          {items.map(({ category, comparisons }, index) => (
            <div key={index}>
              <h3>{index} - {category}</h3>
              <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Stable</th>
                  <th>Beta</th>
                  <th>Diff</th>
                  <th>Slider</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item: ScreenshotComparison, index: number) => (
                  <tr key={index}>
                    <td>{item.order}</td>
                    <td><img src={`${HOST}/${item.a}`} alt="Stable version" style={{ width: "100px", cursor: 'pointer' }} onClick={() => handleShow(`${HOST}/${item.a}`, '')} /></td>
                    <td><img src={`${HOST}/${item.b}`} alt="Beta version" style={{ width: "100px", cursor: 'pointer' }} onClick={() => handleShow(`${HOST}/${item.b}`, '')} /></td>
                    <td><img src={`${HOST}/${item.diff}`} alt="Differences version" style={{ width: "100px", cursor: 'pointer' }} onClick={() => handleShow(`${HOST}/${item.diff}`, '')} /></td>
                    <td>
                    <Button variant="primary" onClick={() => handleShow(`${HOST}/${item.a}`, `${HOST}/${item.b}`)}>Compare Images</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
          ))}
        </Tab>
      ))}
    </Tabs>
  
        <Modal size='xl' show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Image Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {rightImage ? (
                <ReactCompareImage leftImage={leftImage} rightImage={rightImage} />
            ) : (
                <img src={leftImage} alt="Preview" style={{ width: "100%" }} />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

export default ImageDiff;
