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
      // Load and run tests
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
          setIsRunning(false);
          resolve(suites);
        }
      };
      
      script.onerror = () => {
        setIsRunning(false);
        resolve(suites);
      };

      document.head.appendChild(script);
    });
  }, []);

  return { runTests, isRunning, results };
}
