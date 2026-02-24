import { useEffect, useState } from 'react';
import { CodeBlock } from '@/components/CodeBlock';
import { InteractiveExampleCard } from '@/components/InteractiveExampleCard';
import { AttributeCard } from '@/components/AttributeCard';
import { TestRunner } from '@/components/TestRunner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { examples } from '@/data/examples';
import {
  validationAttributes,
  formattingAttributes,
  displayAttributes,
  localeAttributes,
  advancedAttributes,
} from '@/data/attributes';
import { testSuites as initialTestSuites } from '@/data/tests';
import { frameworkBindings } from '@/data/frameworkBindings';
import { Terminal, Zap, Shield, Globe, Package, FileText, Layers, Info } from 'lucide-react';
import { SiReact, SiVuedotjs, SiAngular, SiSvelte, SiSolid, SiQwik, SiAstro } from 'react-icons/si';
import { loadNumericInputScript } from '@/hooks/useNumericInput';
import { useTestRunner } from '@/hooks/useTestRunner';

export default function Home() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { runTests, isRunning } = useTestRunner();

  useEffect(() => {
    loadNumericInputScript()
      .then(() => setScriptLoaded(true))
      .catch(error => console.error('Failed to load NumericInput script:', error));
  }, []);
  const installCode = `npm install numeric-input
# or
yarn add numeric-input
# or
pnpm add numeric-input`;

  const quickStartCode = `import NumericInput from 'numeric-input';

// Attach to a single input
const input = document.querySelector('input[type="number"]');
NumericInput.attach(input);

// Or attach to multiple inputs
const inputs = document.querySelectorAll('.numeric-input');
NumericInput.attach(inputs);`;

  const apiCode = `// Attach to element(s)
NumericInput.attach(element);
NumericInput.attach(nodeList);

// Detach from element(s)
NumericInput.detach(element);
NumericInput.detach(nodeList);

// Core methods (for framework integration)
NumericInput.parseConfig(element);
NumericInput.validateKeystroke(event, config);
NumericInput.formatValue(value, config);
NumericInput.handleArrowKey(direction, currentValue, config);`;

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section id="getting-started" className="space-y-6 pt-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">NumericInput.js</h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            A powerful, framework-agnostic JavaScript library for advanced numeric input handling. 
            Support for multiple number bases, locale-aware formatting, intelligent validation, 
            and comprehensive keyboard interactions.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="text-sm px-3 py-1">Framework Agnostic</Badge>
            <Badge className="text-sm px-3 py-1">TypeScript Support</Badge>
            <Badge className="text-sm px-3 py-1">Zero Dependencies</Badge>
            <Badge className="text-sm px-3 py-1">2KB Gzipped</Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card>
            <CardHeader className="space-y-2">
              <Shield className="w-8 h-8 text-primary" />
              <CardTitle className="text-base">Smart Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Prevent invalid keystrokes before they're entered, enforce min/max ranges, and validate increments with configurable debounce
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-2">
              <Zap className="w-8 h-8 text-primary" />
              <CardTitle className="text-base">Easy Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Simple vanilla JS attach/detach API with React, Vue, Angular, Svelte, and more framework bindings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-2">
              <Globe className="w-8 h-8 text-primary" />
              <CardTitle className="text-base">Locale Aware</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatic formatting based on locale with custom separator support via the browser Intl API
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-2">
              <Layers className="w-8 h-8 text-primary" />
              <CardTitle className="text-base">Rich Feature Set</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Multi-base support (2-36), floating point precision and rounding, currencies with prefix/postfix, percentage shorthands, and value-algebra transformations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Installation */}
        <div className="space-y-3 mt-8">
          <h2 className="text-2xl font-semibold">Installation</h2>
          <CodeBlock code={installCode} language="bash" />
        </div>

        {/* Quick Start */}
        <div className="space-y-3 mt-8">
          <h2 className="text-2xl font-semibold">Quick Start</h2>
          <CodeBlock code={quickStartCode} language="javascript" />
        </div>
      </section>

      {/* Attributes Reference */}
      <section id="attributes" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Attributes Reference</h2>
          <p className="text-muted-foreground">
            Comprehensive list of all supported attributes for customizing numeric input behavior.
          </p>
        </div>

        <Tabs defaultValue="validation" className="space-y-4">
          <TabsList className="flex flex-wrap gap-1 h-auto w-full lg:w-auto">
            <TabsTrigger value="validation" data-testid="tab-validation">Validation</TabsTrigger>
            <TabsTrigger value="formatting" data-testid="tab-formatting">Formatting</TabsTrigger>
            <TabsTrigger value="display" data-testid="tab-display">Display</TabsTrigger>
            <TabsTrigger value="locale" data-testid="tab-locale">Locale</TabsTrigger>
            <TabsTrigger value="advanced" data-testid="tab-advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="validation" id="attr-validation" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {validationAttributes.map((attr) => (
                <AttributeCard key={attr.name} attribute={attr} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="formatting" id="attr-formatting" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {formattingAttributes.map((attr) => (
                <AttributeCard key={attr.name} attribute={attr} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="display" id="attr-display" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {displayAttributes.map((attr) => (
                <AttributeCard key={attr.name} attribute={attr} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="locale" id="attr-locale" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {localeAttributes.map((attr) => (
                <AttributeCard key={attr.name} attribute={attr} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advanced" id="attr-advanced" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {advancedAttributes.map((attr) => (
                <AttributeCard key={attr.name} attribute={attr} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Examples */}
      <section id="examples" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Examples</h2>
          <p className="text-muted-foreground">
            Interactive examples demonstrating various configurations and use cases.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {examples.map((example) => (
            <InteractiveExampleCard key={example.id} example={example} scriptLoaded={scriptLoaded} />
          ))}
        </div>
      </section>

      {/* Framework Bindings */}
      <section id="framework-bindings" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Framework Bindings</h2>
          <p className="text-muted-foreground">
            Ready-to-use components for popular frameworks. Install the package and use the component directly.
          </p>
        </div>

        <Tabs defaultValue="react" className="space-y-4">
          <TabsList className="flex flex-wrap gap-1 h-auto w-full lg:w-auto">
            {frameworkBindings.map((fw) => {
              const iconMap: Record<string, typeof SiReact> = {
                react: SiReact,
                vue: SiVuedotjs,
                angular: SiAngular,
                svelte: SiSvelte,
                solid: SiSolid,
                qwik: SiQwik,
                astro: SiAstro,
              };
              const IconComponent = iconMap[fw.icon];
              return (
                <TabsTrigger key={fw.id} value={fw.id} data-testid={`tab-framework-${fw.id}`} className="gap-1.5">
                  {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                  <span>{fw.name}</span>
                  {fw.type === 'package' ? (
                    <Package className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <FileText className="w-3 h-3 text-muted-foreground" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {frameworkBindings.map((fw) => (
            <TabsContent key={fw.id} value={fw.id} className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold">{fw.name}</h3>
                <Badge variant={fw.type === 'package' ? 'default' : 'secondary'}>
                  {fw.type === 'package' ? 'Package' : 'Docs Only'}
                </Badge>
              </div>

              {fw.installInstructions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Installation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock code={fw.installInstructions} language="bash" />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Usage</CardTitle>
                  <CardDescription>
                    {fw.type === 'package'
                      ? `Install the ${fw.name} package and use the component as shown below.`
                      : `Integrate NumericInput.js with ${fw.name} using the component pattern below.`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={fw.usageCode} language="typescript" />
                </CardContent>
              </Card>

              {fw.bindingSource && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Binding Source</CardTitle>
                    <CardDescription>
                      Full component source code. Included in the npm package.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock code={fw.bindingSource} language="typescript" />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Tests */}
      <section id="tests" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Test Suite</h2>
          <p className="text-muted-foreground">
            Comprehensive test coverage for all library features. Run tests to validate functionality.
          </p>
        </div>

        {scriptLoaded ? (
          <TestRunner suites={initialTestSuites} onRunTests={runTests} isRunning={isRunning} />
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading test suite...</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* API Reference */}
      <section id="api" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">API Reference</h2>
          <p className="text-muted-foreground">
            Core API methods for integrating NumericInput with any framework or vanilla JavaScript.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Core Methods</CardTitle>
            <CardDescription>
              Public API for attaching, detaching, and integrating with custom frameworks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock code={apiCode} language="javascript" />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-mono">attach(element)</CardTitle>
              <CardDescription>Attach library to element(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <strong>Parameters:</strong> <code className="text-xs bg-muted px-1 py-0.5 rounded">element</code> - HTMLElement or NodeList
              </p>
              <p className="text-sm">
                <strong>Returns:</strong> void
              </p>
              <p className="text-sm text-muted-foreground">
                Attaches event handlers and initializes the library on the target input element(s).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-mono">detach(element)</CardTitle>
              <CardDescription>Remove library from element(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <strong>Parameters:</strong> <code className="text-xs bg-muted px-1 py-0.5 rounded">element</code> - HTMLElement or NodeList
              </p>
              <p className="text-sm">
                <strong>Returns:</strong> void
              </p>
              <p className="text-sm text-muted-foreground">
                Removes event handlers and cleans up the library from the target element(s).
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* About This Project */}
      <section id="about" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">About This Project</h2>
        </div>

        <Card>
          <CardHeader className="space-y-2">
            <Info className="w-8 h-8 text-primary" />
            <CardTitle>An AI-Assisted Development Experiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              NumericInput.js is an experiment in replicating the feature set of a React library that I, a developer with three decades of experience, had previously created by hand. This time, the entire codebase was built using AI tools without any manual coding — just a couple of thorough human code reviews before publishing to GitHub.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I started this project about four months ago but paused early on because it felt like I had to babysit the AI too much — constantly correcting course and re-explaining intent. When I returned to it in late February, two things had changed: I had learned to use structured planning to guide the AI more effectively, and the models themselves had improved significantly. The combination made the process feel genuinely satisfying rather than frustrating.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The result is a fully framework-agnostic vanilla JavaScript library with comprehensive test coverage, interactive documentation, and ready-to-use framework bindings — all produced through human-AI collaboration where the human provides direction and review, and the AI handles implementation.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
