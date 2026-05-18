import { Layout } from './components/Layout/Layout';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Projects } from './components/Projects/Projects';
import { Notes } from './components/Notes/Notes';
import { Skills } from './components/Skills/Skills';
import { Contact } from './components/Contact/Contact';

function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <Projects />
      <Notes />
      <Skills />
      <Contact />
    </Layout>
  );
}

export default App;
