import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';

const IssuesContext = createContext({ issues: [], addIssue: () => {}, clearIssues: () => {} });

export function IssuesProvider({ children }) {
  const [issues, setIssues] = useState(() => {
    try {
      const raw = localStorage.getItem('issues_state_v1');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('issues_state_v1', JSON.stringify(issues));
    } catch (e) {
      // ignore persistence errors
    }
  }, [issues]);

  const addIssue = useCallback((issue) => {
    setIssues((prev) => [
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
        resolved: false, // Add resolved property
        ...issue,
      },
      ...prev,
    ]);
  }, []);

  const toggleIssueResolved = useCallback((issueId) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, resolved: !issue.resolved } : issue
      )
    );
  }, []);

  const clearIssues = useCallback(() => setIssues([]), []);

  const value = useMemo(() => ({ issues, addIssue, clearIssues, toggleIssueResolved }), [issues, addIssue, clearIssues, toggleIssueResolved]);

  return <IssuesContext.Provider value={value}>{children}</IssuesContext.Provider>;
}

export function useIssues() {
  return useContext(IssuesContext);
}


