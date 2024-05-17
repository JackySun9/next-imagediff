'use client';

import React, { useEffect, useState } from 'react';
import { fetchFileFromGithub } from '../lib/utils/githubUtils';

interface GithubDirectoriesProps {
  repo: string; // Format: "username/repo"
  path: string; // Format: "path/to/directory"
}

interface Directory {
  name: string;
  path: string;
}

const GithubDirectories: React.FC<GithubDirectoriesProps> = ({ repo, path }) => {
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDirectories = async () => {
      setLoading(true);
      try {
        const contents = await fetchFileFromGithub(repo, path);
        parseDirectories(contents);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDirectories();
  }, [repo, path]);

  const parseDirectories = (contents: any[]) => {
    const dirs = contents
      .filter(item => item.type === 'dir')
      .map(dir => ({
        name: dir.name,
        path: dir.path
      }));
    setDirectories(dirs);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Screenshot Tests:</h3>
      <div className='text-xl flex flex-row gap-6 m-3 flex-wrap'>
        {directories.map((directory, index) => (
          <div className="card w-80 bg-base-100 shadow-xl flex-auto" key={index}>
          <figure>
            <img src="dog.jpg" alt={`${index}`}/>
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title uppercase">{directory.name}</h2>
            <p>screenshots under three resolutions</p>
            <div className="card-actions">
              <a className="btn btn-primary" href={`/imagediff?category=${directory.name}`}>Check</a>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default GithubDirectories;
