import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Check, X, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { TestSuite, TestCase } from '@shared/schema';

interface TestRunnerProps {
  suites: TestSuite[];
  onRunTests?: (suites: TestSuite[]) => Promise<TestSuite[]>;
  isRunning?: boolean;
}

export function TestRunner({ suites: initialSuites, onRunTests, isRunning = false }: TestRunnerProps) {
  const [suites, setSuites] = useState(initialSuites);
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set());
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());

  const handleRunTests = async () => {
    if (onRunTests) {
      const updatedSuites = await onRunTests(suites);
      setSuites(updatedSuites);
    }
  };

  const toggleSuite = (suiteId: string) => {
    setExpandedSuites(prev => {
      const next = new Set(prev);
      if (next.has(suiteId)) {
        next.delete(suiteId);
      } else {
        next.add(suiteId);
      }
      return next;
    });
  };

  const toggleTest = (testId: string) => {
    setExpandedTests(prev => {
      const next = new Set(prev);
      if (next.has(testId)) {
        next.delete(testId);
      } else {
        next.add(testId);
      }
      return next;
    });
  };

  const totalTests = suites.reduce((sum, suite) => sum + suite.tests.length, 0);
  const passedTests = suites.reduce(
    (sum, suite) => sum + suite.tests.filter(t => t.status === 'passed').length,
    0
  );
  const failedTests = suites.reduce(
    (sum, suite) => sum + suite.tests.filter(t => t.status === 'failed').length,
    0
  );

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'passed':
        return <Check className="w-4 h-4 text-chart-2" />;
      case 'failed':
        return <X className="w-4 h-4 text-destructive" />;
      case 'running':
        return <Clock className="w-4 h-4 text-chart-3 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: TestCase['status']) => {
    switch (status) {
      case 'passed':
        return (
          <Badge variant="outline" className="text-xs border-chart-2 text-chart-2">
            Passed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="text-xs border-destructive text-destructive">
            Failed
          </Badge>
        );
      case 'running':
        return (
          <Badge variant="outline" className="text-xs border-chart-3 text-chart-3">
            Running
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Test Suite</CardTitle>
              <CardDescription>Run comprehensive tests to validate library functionality</CardDescription>
            </div>
            <Button
              onClick={handleRunTests}
              disabled={isRunning}
              data-testid="button-run-tests"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run All Tests'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 p-4 bg-muted rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
              <span className="text-sm font-medium">Total: {totalTests}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-chart-2"></div>
              <span className="text-sm font-medium text-chart-2">Passed: {passedTests}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive"></div>
              <span className="text-sm font-medium text-destructive">Failed: {failedTests}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {suites.map(suite => (
          <Card key={suite.id} data-testid={`card-test-suite-${suite.id}`}>
            <Collapsible open={expandedSuites.has(suite.id)} onOpenChange={() => toggleSuite(suite.id)}>
              <CardHeader className="hover-elevate cursor-pointer">
                <CollapsibleTrigger className="w-full" data-testid={`button-toggle-suite-${suite.id}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-left">
                      {expandedSuites.has(suite.id) ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <div>
                        <CardTitle className="text-base">{suite.name}</CardTitle>
                        <CardDescription className="text-sm">{suite.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {suite.tests.length} tests
                    </Badge>
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0">
                  {suite.tests.map(test => (
                    <div key={test.id} data-testid={`test-case-${test.id}`}>
                      <Collapsible open={expandedTests.has(test.id)} onOpenChange={() => toggleTest(test.id)}>
                        <CollapsibleTrigger className="w-full" data-testid={`button-toggle-test-${test.id}`}>
                          <div className="flex items-center gap-3 p-3 rounded-md border border-border hover-elevate">
                            {getStatusIcon(test.status)}
                            <span className="text-sm font-medium flex-1 text-left">{test.name}</span>
                            {getStatusBadge(test.status)}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-2 ml-7 p-3 bg-muted rounded-md space-y-2">
                            <p className="text-sm text-muted-foreground">{test.description}</p>
                            {test.error && (
                              <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded">
                                <p className="text-xs font-mono text-destructive">{test.error}</p>
                              </div>
                            )}
                            {test.duration !== undefined && (
                              <p className="text-xs text-muted-foreground">Duration: {test.duration}ms</p>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}
