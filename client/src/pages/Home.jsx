import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import ErrorCard from '../components/ErrorCard.jsx';
import { fetchGithubData, analyzeRepo } from '../services/api.js';

function Home() {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "🔍 Fetching repository info",
    "📁 Reading codebase structure",
    "🤖 AI is analyzing...",
    "💾 Saving your report",
    "✨ Almost ready!"
  ];

  const handleAnalyze = async (url) => {
    const trimmedUrl = (url || '').trim();

    if (!trimmedUrl) {
      setError({ message: 'Please enter a GitHub repository URL', status: 400 });
      return;
    }

    setRepoUrl(trimmedUrl);
    setIsLoading(true);
    setError(null);
    setCurrentStep(0);

    console.log('[Home] Analyzing URL:', trimmedUrl);

    try {
      // Step 1: Fetch GitHub Data
      const repoData = await fetchGithubData(trimmedUrl);
      console.log('[Home] repoData received:', repoData?.owner + '/' + repoData?.repo);

      // Step 2: Visual spacing while reading structure
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Run AI analysis and save report
      setCurrentStep(2);
      const analysisResult = await analyzeRepo(repoData);
      console.log('[Home] analysisResult:', analysisResult?.analysisId);

      // Step 4: Saving report visual confirmation
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Step 5: Finalizing
      setCurrentStep(4);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to /report/:id
      navigate(`/report/${analysisResult.analysisId}`);
    } catch (err) {
      console.error('[Home] Analyze flow failure:', err.message);
      setError({
        message: err.message || 'Failed to complete analysis.',
        status: 500
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (repoUrl) {
      handleAnalyze(repoUrl);
    }
  };

  return (
    <div className="home-page-container">
      {/* 1. Fixed Header */}
      <Navbar />

      {/* 2. Error Card if failed */}
      {error && (
        <div className="home-error-overlay">
          <ErrorCard error={error} onRetry={handleRetry} />
        </div>
      )}

      {/* 3. Hero layout */}
      <Hero onAnalyze={handleAnalyze} isLoading={isLoading} />

      {/* 4. How It Works layout */}
      <HowItWorks />

      {/* 5. Loading screen backdrop overlay */}
      {isLoading && (
        <LoadingScreen steps={steps} currentStep={currentStep} />
      )}

      <style>{`
        .home-page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .home-error-overlay {
          max-width: 800px;
          width: 100%;
          margin: 80px auto -40px;
          padding: 0 24px;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}

export default Home;
