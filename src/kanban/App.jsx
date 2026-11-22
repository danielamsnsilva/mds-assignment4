import { CHAPTER_COMPONENTS } from './chapters/chapterRegistry.js';
import { QuickCheck } from './components/QuickCheck.jsx';
import { AppHeader } from './components/layout/AppHeader.jsx';
import { ChapterFooter } from './components/layout/ChapterFooter.jsx';
import { ChapterHeading } from './components/layout/ChapterHeading.jsx';
import { Toast } from './components/layout/Toast.jsx';
import { ChatWidget } from './components/overlays/ChatWidget.jsx';
import { GlossaryDialog } from './components/overlays/GlossaryDialog.jsx';
import { GlossaryPopover } from './components/overlays/GlossaryPopover.jsx';
import { FlowLabProvider, useFlowLab } from './state/FlowLabContext.jsx';
import { selectCurrentChapter } from './state/selectors.js';

function CurrentChapter() {
  const { state } = useFlowLab();
  const { key } = selectCurrentChapter(state);
  const Chapter = CHAPTER_COMPONENTS[key];
  const isStart = key === 'start';
  const isDebrief = key === 'finish';

  return (
    <main className="chapter-main">
      {!isStart && <ChapterHeading />}
      <Chapter />
      <QuickCheck chapterKey={key} />
      {!isStart && !isDebrief && <ChapterFooter />}
    </main>
  );
}

export function App() {
  return (
    <FlowLabProvider>
      <div className="flowlab">
        <AppHeader />
        <CurrentChapter />
        <Toast />
        <GlossaryPopover />
        <GlossaryDialog />
        <ChatWidget />
      </div>
    </FlowLabProvider>
  );
}
