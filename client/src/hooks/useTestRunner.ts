import { useState, useCallback } from 'react';
import type { TestSuite, TestCase } from '@shared/schema';

interface TestResult {
  total: number;
  passed: number;
  failed: number;
  tests: Array<{
    suite: string;
    name: string;
    status: TestCase['status'];
    error?: string;
    duration?: number;
  }>;
}

export function useTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult | null>(null);

  const runTests = useCallback(async (suites: TestSuite[]): Promise<TestSuite[]> => {
    setIsRunning(true);

    return new Promise((resolve) => {
      // Ensure NumericInput library is loaded first
      if (!(window as any).NumericInput) {
        console.error('NumericInput library not loaded');
        setIsRunning(false);
        resolve(suites);
        return;
      }

      // Check if test script is already loaded
      if ((window as any).TestRunner) {
        // Tests already loaded, just run them
        const testRunner = (window as any).TestRunner;
        testRunner.run().then((results: any) => {
          const updatedSuites = suites.map(suite => ({
            ...suite,
            tests: suite.tests.map(test => {
              const result = results.tests.find((t: any) => 
                t.suite === suite.name && t.name === test.name
              );
              
              if (result) {
                return {
                  ...test,
                  status: result.status as TestCase['status'],
                  error: result.error,
                  duration: result.duration,
                };
              }
              return test;
            }),
          }));

          setResults(results);
          setIsRunning(false);
          resolve(updatedSuites);
        });
        return;
      }

      // Load test script for the first time
      const script = document.createElement('script');
      script.src = '/numeric-input.test.js';
      script.onload = async () => {
        // Wait a bit for the script to initialize
        await new Promise(r => setTimeout(r, 100));

        // Run tests
        if ((window as any).TestRunner) {
          const testRunner = (window as any).TestRunner;
          const results = await testRunner.run();

          // Map results back to suites
          const updatedSuites = suites.map(suite => ({
            ...suite,
            tests: suite.tests.map(test => {
              const result = results.tests.find((t: any) => 
                t.suite === suite.name && t.name === test.name
              );
              
              if (result) {
                return {
                  ...test,
                  status: result.status as TestCase['status'],
                  error: result.error,
                  duration: result.duration,
                };
              }
              return test;
            }),
          }));

          setResults(results);
          setIsRunning(false);
          resolve(updatedSuites);
        } else {
          console.error('TestRunner not found after script load');
          setIsRunning(false);
          resolve(suites);
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load test script');
        setIsRunning(false);
        resolve(suites);
      };

      document.head.appendChild(script);
    });
  }, []);

  return { runTests, isRunning, results };
}
