'use client';

import React, { useEffect, useState } from 'react';

// Define a type for the pull request data
type PullRequest = {
  id: number;
  html_url: string;
  title: string;
};

const PullRequests: React.FC = () => {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [selectedPRId, setSelectedPRId] = useState<string>('');

  useEffect(() => {
    const fetchPRs = async () => {
      const response = await fetch('https://api.github.com/repos/adobecom/milo/pulls');
      const data: PullRequest[] = await response.json();
      setPullRequests(data);
    };

    fetchPRs();
  }, []);

  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPRId(event.target.value);
  };

  return (
    <div className="pb-5">
      <label htmlFor="pr-select"><h3>Milo PR List:</h3></label>
      <select id="pr-select" value={selectedPRId} onChange={handleSelectionChange} className="ml-2 p-2 border rounded">
        <option value="">Select a Pull Request</option>
        {pullRequests.map((pr) => (
          <option key={pr.id} value={pr.id}>
            {pr.title}
          </option>
        ))}
      </select>
      {selectedPRId && (
        <div className="mt-3">
          <a href={pullRequests.find(pr => pr.id.toString() === selectedPRId)?.html_url || '#'} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-blue-500 hover:text-blue-700">
            View Selected PR
          </a>
        </div>
      )}
    </div>
  );
};

export default PullRequests;
