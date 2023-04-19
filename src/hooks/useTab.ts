import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
/**
 * useTab is react custom hook to remember the active tab in the url, so that when history.back() can restore the previous state
 * It url contains ?tab query parameter it will select that particular tab
 * @param tabs this is array of object [{title: "tab1 title", active:true}, {title: "tab 2 title"}]. add active:true key to make that tab active by default
 * @queryParam tab. e.g http://localhost:3000?tab=0
 */
type Tab = {
  title: string;
  active?: boolean;
};

const QUERY_PARAM_NAME = 'tab';

export default function useTab(tabs: Tab[], saveState: boolean = true) {
  const defaultTab = useMemo(() => {
    return Math.max(
      tabs.findIndex(tab => tab.active),
      0
    );
  }, [tabs]);

  const router = useRouter();
  const { tab } = router.query;

  const validTab = tab && !isNaN(+tab) && +tab > 0 && +tab < tabs.length ? +tab : defaultTab;
  const [activeTab, setActiveTab] = useState(validTab);

  useEffect(() => {
    setActiveTab(validTab);
  }, [validTab]);

  const handleTabChange = useCallback(
    (_: MouseEvent, index: number) => {
      setActiveTab(index);

      if (!saveState) return;

      // remember/remove page in the url
      if (index === defaultTab) {
        delete router.query[QUERY_PARAM_NAME];
      } else {
        router.query[QUERY_PARAM_NAME] = String(index);
      }
      router.push(router);
    },
    [defaultTab, router, saveState]
  );

  return { tabs, activeTab, handleTabChange, setActiveTab };
}
