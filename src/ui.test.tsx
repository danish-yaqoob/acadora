import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, it, expect } from 'vitest';
import { Preferences } from './Settings';
import { defaults } from './data';
import { useState } from 'react';
afterEach(cleanup);
it('offers labeled onboarding preferences and theme switching',()=>{function Harness(){const [s,setS]=useState(defaults);return <><Preferences settings={s} onChange={setS}/><output>{s.name} {s.theme} {s.goal}</output></>;}render(<Harness/>);fireEvent.change(screen.getByLabelText('Preferred name'),{target:{value:'Ada'}});fireEvent.change(screen.getByLabelText('Appearance'),{target:{value:'dark'}});fireEvent.change(screen.getByLabelText('Daily study goal (minutes)'),{target:{value:'90'}});expect(screen.getByRole('status')).toHaveTextContent('Ada dark 90');});
