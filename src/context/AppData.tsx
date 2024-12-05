import moment from 'moment';
import React, { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { Location, NavigateFunction, NavigateOptions } from 'react-router-dom';

interface IAppDataContext {
  subject: ISubject | null;
  topic: ITopics | null;
  path: {
    route: IPath[]
    push: (path: IPath) => void
    pop: () => void
    replace: (path: IPath, options?: NavigateOptions) => void
  }
  tasks: {
    selectedDate: moment.Moment,
    task: Task | null,
    setTask: (task: Task) => void,
    setSelectedDate: (date: moment.Moment) => void
  }
  setSubject: (subject: ISubject | null) => void;
  setTopic: (topic: ITopics | null) => void;
  sidebar: {
    isOpen: boolean,
    toggle: () => void
  },
  pendingProgress: {
    pendigScoreVideos: number[],
    setPendingScoreVideos: (videos: number[]) => void,
    pendingSubmitVideos: number[],
    setPendingSubmitVideos: (videos: number[]) => void
  },
  lastTaskTab: {
    id: number,
    setLastTaskTab: (id: number) => void
  },
  badges: {
    set: {
      chats: (count: number) => void
    },
    get: {
      chats: number
    }
  },
  communities: {
    set: (communities: AmityCommunities) => void,
    groupCommunity: GroupCommunity | null,
    siteCommunity: AmitySiteCommunity[]

  }

}

interface IPath {
  name: string,
  path: string
}

const AppDataContext = createContext<IAppDataContext>({
  subject: null,
  topic: null,
  setSubject: () => { },
  setTopic: () => { },
  path: {
    route: [{ name: '/', path: '/' }],
    push: () => { },
    pop: () => { },
    replace: () => { }
  },
  sidebar: {
    isOpen: true,
    toggle: () => { }
  },
  tasks: {
    selectedDate: moment(),
    task: null,
    setTask: () => { },
    setSelectedDate: () => { }
  },
  pendingProgress: {
    pendigScoreVideos: [],
    setPendingScoreVideos: () => { },
    pendingSubmitVideos: [],
    setPendingSubmitVideos: () => { }
  },
  lastTaskTab: {
    id: 0,
    setLastTaskTab: () => { }
  },
  badges: {
    set: {
      chats: () => { }
    },
    get: {
      chats: 0
    }
  },
  communities: {
    set: () => { },
    groupCommunity: null,
    siteCommunity: []
  }
});

const AppDataProvider = ({ navigate, location, children }: PropsWithChildren & { navigate: NavigateFunction, location: Location<any> }) => {
  const [subject, setSubject] = useState<ISubject | null>(null);
  const [topic, setTopic] = useState<ITopics | null>(null);
  const [path, setPath] = useState<IPath[]>([])
  const [slideOpen, setSlideOpen] = useState(true);
  const [task, setTask] = useState<Task | null>(null)
  const [selectedDate, setSelectedDate] = useState(moment())
  const [uncountChats, setUncountChats] = useState(0)
  const [communities, setCommunities] = useState<AmityCommunities | null>(null)

  const [pendigScoreVideos, setPendingScoreVideos] = useState<number[]>([])
  const [pendingSubmitVideos, setPendingSubmitVideos] = useState<number[]>([])

  const [lastTaskTab, setLastTaskTab] = useState<number>()

  useEffect(() => {
    if (subject) {
      localStorage.setItem('subject', JSON.stringify(subject));
    }
    if (topic) {
      localStorage.setItem('topic', JSON.stringify(topic));
    }
    const newPath = path.slice().reverse().filter((value, index, self) => self.findIndex((t) => (t.path === value.path)) === index).reverse();
    if (newPath.length > 0) {
      localStorage.setItem('path', JSON.stringify(newPath));
    }
    if (task) {
      localStorage.setItem('task', JSON.stringify(task))
    }
    if (selectedDate) {
      localStorage.setItem('selectedDate', JSON.stringify(selectedDate))
    }
    if (pendigScoreVideos.length > 0) {
      localStorage.setItem('pendigScoreVideos', JSON.stringify(pendigScoreVideos))
    }
    if (pendingSubmitVideos.length > 0) {
      localStorage.setItem('pendingSubmitVideos', JSON.stringify(pendingSubmitVideos))
    }
    if (lastTaskTab) {
      localStorage.setItem('lastTaskTab', lastTaskTab.toString())
    }
    if (uncountChats) {
      localStorage.setItem('uncountChats', uncountChats.toString())
    }
    if (communities) {
      localStorage.setItem('communities', JSON.stringify(communities))
    }
  }, [subject, topic, path, task, selectedDate, pendigScoreVideos, lastTaskTab, pendingSubmitVideos, uncountChats, communities]);

  useEffect(() => {
    // Obtener los valores de localStorage al cargar la página
    const storedSubject = localStorage.getItem('subject');
    const storedTopic = localStorage.getItem('topic');
    const storedPath = localStorage.getItem('path');
    const storedTask = localStorage.getItem('task');
    const storedPendigScoreVideos = localStorage.getItem('pendigScoreVideos')
    const storedLastTaskTab = localStorage.getItem('lastTaskTab')
    const storedPendingSubmitVideos = localStorage.getItem('pendingSubmitVideos')
    const storedUncountChats = localStorage.getItem('uncountChats')
    const storedCommunities = localStorage.getItem('communities')
    if (storedPendingSubmitVideos) {
      setPendingSubmitVideos(JSON.parse(storedPendingSubmitVideos))
    }

    if (storedLastTaskTab) {
      setLastTaskTab(parseInt(storedLastTaskTab))
    }

    if (storedSubject) {
      setSubject(JSON.parse(storedSubject));
    }

    if (storedTopic) {
      setTopic(JSON.parse(storedTopic));
    }
    if (storedPath) {
      setPath(JSON.parse(localStorage.getItem('path') || '[]'))
    }
    if (storedTask) {
      setTask(JSON.parse(storedTask))
    }

    const storedDate = localStorage.getItem('selectedDate');
    if (storedDate) {
      setSelectedDate(moment(JSON.parse(storedDate)));
    } else {
      setSelectedDate(moment());
    }
    if (storedPendigScoreVideos) {
      setPendingScoreVideos(JSON.parse(storedPendigScoreVideos))
    }
    if (storedUncountChats) {
      setUncountChats(parseInt(storedUncountChats))
    }
    if (storedCommunities) {
      setCommunities(JSON.parse(storedCommunities))
    }
  }, []);


  const pushPath = (mpath: IPath) => {
    setPath((prev) => [...prev, mpath])
    navigate(`${location.pathname}/${mpath.path}`, { replace: true })
  }

  const replacePath = (mpath: IPath, options?: NavigateOptions) => {
    setPath((prev) => [...prev.slice(0, prev.length - 1), mpath])
    navigate(`${mpath.path}`, { replace: true, ...options })
  }

  const popPath = () => {
    const pathArray = location.pathname.split("/");
    const pathTo = `${pathArray.slice(0, pathArray.length - 1).join("/")}`;
    navigate(pathTo)
  }

  const toggleSidebar = () => {
    let s = !slideOpen
    localStorage.setItem('slide', s.toString())
    setSlideOpen(s)
  }

  return (
    <AppDataContext.Provider value={{
      subject, topic, setSubject, setTopic, path: {
        route: path,
        push: pushPath,
        pop: popPath,
        replace: replacePath
      },
      sidebar: {
        isOpen: slideOpen,
        toggle: toggleSidebar
      },
      tasks: {
        selectedDate,
        task,
        setTask,
        setSelectedDate
      },
      pendingProgress: {
        pendigScoreVideos,
        setPendingScoreVideos,
        pendingSubmitVideos,
        setPendingSubmitVideos
      },
      badges: {
        set: {
          chats: (count: number) => setUncountChats(count)
        },
        get: {
          chats: uncountChats
        }
      },
      lastTaskTab: {
        id: lastTaskTab ?? 0,
        setLastTaskTab
      },
      communities: {
        set: setCommunities,
        groupCommunity: communities?.groupCommunity ?? null,
        siteCommunity: communities?.amitySiteCommunities ?? []
      }
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

const useAppData = () => {
  return React.useContext(AppDataContext);
};

export { AppDataProvider, useAppData };
