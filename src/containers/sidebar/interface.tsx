import { RouteComponentProps } from "react-router";

export interface SidebarProps extends RouteComponentProps<any> {
  mode: string;
  role: "student" | "admin" | null;
  isCollapsed: boolean;
  shelfTitle: string;
  isAuthed: boolean;
  isOpenSortShelfDialog: boolean;
  handleMode: (mode: string) => void;
  handleSortShelfDialog: (isOpenSortShelfDialog: boolean) => void;
  handleSearch: (isSearch: boolean) => void;
  handleCollapse: (isCollapsed: boolean) => void;
  handleSortDisplay: (isSortDisplay: boolean) => void;
  handleSelectBook: (isSelectBook: boolean) => void;
  handleShelf: (shelfTitle: string) => void;
  handleFetchBooks: () => void;
  t: (title: string) => string;
}

export interface SidebarState {
  mode: string;
  hoverMode: string;
  hoverShelfTitle: string;
  isCollapsed: boolean;
  isCollpaseShelf: boolean;
  shelfTitle: string;
  newShelfName: string;
  isOpenDelete: boolean;
  isCreateShelf: boolean;
  dropTargetShelf: string;
  // Separate from isCollapsed (a persisted desktop preference toggling the
  // full sidebar vs. a narrow icon rail) - on a narrow screen the sidebar is
  // hidden entirely by default and slides in as an overlay, independent of
  // whatever desktop collapse preference is saved.
  isMobileMenuOpen: boolean;
}
