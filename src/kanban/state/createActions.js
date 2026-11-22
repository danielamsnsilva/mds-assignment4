import { MDS26_CSV, MDS26_SAMPLE_NAME } from '../config/teamData.js';
import { CertificateRenderer } from '../domain/CertificateRenderer.js';
import { ActionTypes as T } from './flowLabReducer.js';

const scrollToTop = (behavior) => window.scrollTo(behavior ? { top: 0, behavior } : { top: 0 });

/**
 * The commands components can issue. They dispatch reducer actions and run
 * the browser side effects (scrolling, reading files, downloads) that don't
 * belong in the reducer.
 */
export function createActions(dispatch) {
  const certificateRenderer = new CertificateRenderer();

  return {
    // navigation
    choosePath(path) {
      dispatch({ type: T.pathChosen, path });
      scrollToTop();
    },
    goToChapter(index) {
      dispatch({ type: T.chapterSelected, index });
      scrollToTop('smooth');
    },
    completeChapter() {
      dispatch({ type: T.chapterCompleted });
      scrollToTop('smooth');
    },
    restart: () => dispatch({ type: T.progressRestarted }),

    // board
    moveCard: (cardId, direction) => dispatch({ type: T.cardMoved, cardId, direction }),
    dropCard: (cardId, column) => dispatch({ type: T.cardMoved, cardId, column }),
    unblockCard: (cardId) => dispatch({ type: T.cardUnblocked, cardId }),
    resetBoard: () => dispatch({ type: T.boardReset }),

    // basics
    revealMeasure: (index) => dispatch({ type: T.measureRevealed, index }),

    // simulator
    configureSimulation: (field, value) => dispatch({ type: T.simConfigured, field, value }),
    stepSimulation: () => dispatch({ type: T.simStepped }),
    toggleSimulationRun: () => dispatch({ type: T.simRunToggled }),
    tickSimulation: () => dispatch({ type: T.simTicked }),
    resetSimulation: () => dispatch({ type: T.simReset }),

    // multi-stage simulator (H11)
    staffStage: (stage, people) => dispatch({ type: T.stageStaffed, stage, people }),
    restoreStaffing: () => dispatch({ type: T.stageStaffingRestored }),
    stepStageSimulation: () => dispatch({ type: T.stageStepped }),
    toggleStageSimulationRun: () => dispatch({ type: T.stageRunToggled }),
    tickStageSimulation: () => dispatch({ type: T.stageTicked }),
    resetStageSimulation: () => dispatch({ type: T.stageReset }),
    guessBottleneck: (stage) => dispatch({ type: T.bottleneckGuessed, stage }),

    // metrics
    changeLittlesLaw: (field, value) => dispatch({ type: T.lawChanged, field, value }),
    answerLawChallenge: (option) => dispatch({ type: T.lawAnswered, option }),
    editTeamRow: (index, field, value) => dispatch({ type: T.teamRowEdited, index, field, value }),
    importCsvFile(file) {
      file
        .text()
        .then((text) => dispatch({ type: T.csvImported, text, label: file.name }))
        .catch(() => dispatch({ type: T.csvImportFailed, message: 'Could not read the selected CSV file.' }));
    },
    loadSampleData: () => dispatch({ type: T.csvImported, text: MDS26_CSV, label: MDS26_SAMPLE_NAME }),

    // questions
    answerSortStatement: (statement, option) => dispatch({ type: T.sortAnswered, statement, option }),
    answerQuiz: (option) => dispatch({ type: T.quizAnswered, option }),
    nextQuizQuestion: () => dispatch({ type: T.quizAdvanced }),
    restartQuiz: () => dispatch({ type: T.quizRestarted }),
    answerQuickCheck: (chapter, question, option) =>
      dispatch({ type: T.quickCheckAnswered, chapter, question, option }),

    // glossary
    showGlossaryTerm: (key) => dispatch({ type: T.glossaryTermShown, key }),
    openGlossary: () => dispatch({ type: T.glossaryOpened }),
    closeGlossary: () => dispatch({ type: T.glossaryClosed }),
    closeGlossaryTerm: () => dispatch({ type: T.glossaryTermClosed }),
    pressEscape: () => dispatch({ type: T.escapePressed }),

    // chat, certificate, toast
    toggleChat: () => dispatch({ type: T.chatToggled }),
    openChat: () => dispatch({ type: T.chatOpened }),
    closeChat: () => dispatch({ type: T.chatClosed }),
    setCertificateName: (name) => dispatch({ type: T.certificateNameChanged, name }),
    downloadCertificate: (data) => certificateRenderer.download(data),
    dismissToast: (id) => dispatch({ type: T.toastDismissed, id }),
  };
}
