import { User as SupabaseUser } from '@supabase/supabase-js';

// Benutzer-Typ




// Post-Typ (falls Sie einen Post-Typ in Ihrer Anwendung verwenden)


// StreamChat-Typ

import { PropsWithChildren } from 'react';
// Fehler-Typ
export interface AppError extends Error {
  code?: string;
  // Fügen Sie hier weitere Fehlerfelder hinzu, die Sie möglicherweise benötigen
}

// Weitere Typen, die Sie in Ihrer Anwendung verwenden könnten
export type FilterOption = {
  id: string;
  label: string;
  checked: boolean;
};

export type AccordionItemProps = PropsWithChildren<{
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
}>;
