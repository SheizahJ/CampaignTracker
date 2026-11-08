

'use client';

import { DockviewReact, DockviewReadyEvent } from 'dockview-react';
import 'dockview-react/dist/styles/dockview.css';

// 1. Define your custom panel components
const SessionNotesComponent = () => <div className="p-4">Session Notes & Markdown editor...</div>;
const InitiativeComponent = () => <div className="p-4">Initiative Tracker...</div>;
const MonstersComponent = () => <div className="p-4">Monster Stat Blocks...</div>;

const components = {
  notes: SessionNotesComponent,
  initiative: InitiativeComponent,
  monsters: MonstersComponent,
};

export default function VSCodeWorkspace() {
  // 2. Set up the initial layout when the dock initializes
  const onReady = (event: DockviewReadyEvent) => {
    const api = event.api;

    // Add initial panels
    api.addPanel({
      id: 'panel_notes',
      component: 'notes',
      title: 'Session Notes',
    });

    api.addPanel({
      id: 'panel_initiative',
      component: 'initiative',
      title: 'Initiative Tracker',
      position: { referencePanel: 'panel_notes', direction: 'right' },
    });

    api.addPanel({
      id: 'panel_monsters',
      component: 'monsters',
      title: 'Monsters',
      position: { referencePanel: 'panel_notes', direction: 'below' },
    });
  };

  return (
    <div className="h-[80vh] w-full border rounded-lg overflow-hidden">
      <DockviewReact
        components={components}
        onReady={onReady}
        className="dockview-theme-vs" // Gives it that clean VS Code look out of the box
      />
    </div>
  );
}