import { Task, CreateTaskData, UpdateTaskData, TaskFilters, PaginationInfo } from '../types';
import * as localStorageService from './localStorageService';

let useFirebase = true;

export const createTask = async (taskData: CreateTaskData, userId: string): Promise<string> => {
  if (!useFirebase) {
    return localStorageService.createTask(taskData, userId);
  }

  try {
    const {
      collection,
      addDoc,
      serverTimestamp
    } = await import('firebase/firestore');
    const { db } = await import('../config/firebase');
    
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
      ...taskData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.warn('Firebase create failed, using local storage:', error);
    useFirebase = false;
    return localStorageService.createTask(taskData, userId);
  }
};

export const getTasks = async (
  userId: string,
  filters: TaskFilters = {},
  page: number = 1
): Promise<{ tasks: Task[]; pagination: PaginationInfo }> => {
  if (!useFirebase) {
    return localStorageService.getTasks(userId, filters, page);
  }

  try {
    const {
      collection,
      query,
      where,
      orderBy,
      limit,
      getDocs,
      getCountFromServer,
      Timestamp
    } = await import('firebase/firestore');
    const { db } = await import('../config/firebase');
    
    const TASKS_COLLECTION = 'tasks';
    const TASKS_PER_PAGE = 6;
    
    const convertTimestampToDate = (timestamp: any): Date => {
      if (timestamp?.toDate) {
        return timestamp.toDate();
      }
      return new Date(timestamp);
    };
    
    const convertTaskFromFirestore = (doc: any): Task => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: convertTimestampToDate(data.dueDate),
        createdAt: convertTimestampToDate(data.createdAt),
        updatedAt: convertTimestampToDate(data.updatedAt),
        userId: data.userId,
      };
    };
    
    const tasksRef = collection(db, TASKS_COLLECTION);
    let baseQuery = query(
      tasksRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    // Apply filters
    if (filters.status) {
      baseQuery = query(baseQuery, where('status', '==', filters.status));
    }
    
    if (filters.dueDateStart) {
      baseQuery = query(baseQuery, where('dueDate', '>=', Timestamp.fromDate(filters.dueDateStart)));
    }
    
    if (filters.dueDateEnd) {
      baseQuery = query(baseQuery, where('dueDate', '<=', Timestamp.fromDate(filters.dueDateEnd)));
    }

    // Get total count for pagination
    const countSnapshot = await getCountFromServer(baseQuery);
    const totalTasks = countSnapshot.data().count;
    const totalPages = Math.ceil(totalTasks / TASKS_PER_PAGE);

    // Apply pagination
    let paginatedQuery = query(baseQuery, limit(TASKS_PER_PAGE));

    const querySnapshot = await getDocs(paginatedQuery);
    const tasks = querySnapshot.docs.map(convertTaskFromFirestore);

    const pagination: PaginationInfo = {
      currentPage: page,
      totalPages,
      totalTasks,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return { tasks, pagination };
  } catch (error) {
    console.warn('Firebase fetch failed, using local storage:', error);
    useFirebase = false;
    return localStorageService.getTasks(userId, filters, page);
  }
};

export const updateTask = async (taskData: UpdateTaskData): Promise<void> => {
  if (!useFirebase) {
    return localStorageService.updateTask(taskData);
  }

  try {
    const {
      doc,
      updateDoc,
      serverTimestamp
    } = await import('firebase/firestore');
    const { db } = await import('../config/firebase');
    
    const TASKS_COLLECTION = 'tasks';
    const { id, ...updateData } = taskData;
    const taskRef = doc(db, TASKS_COLLECTION, id);
    await updateDoc(taskRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Firebase update failed, using local storage:', error);
    useFirebase = false;
    return localStorageService.updateTask(taskData);
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  if (!useFirebase) {
    return localStorageService.deleteTask(taskId);
  }

  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const { db } = await import('../config/firebase');
    
    const TASKS_COLLECTION = 'tasks';
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.warn('Firebase delete failed, using local storage:', error);
    useFirebase = false;
    return localStorageService.deleteTask(taskId);
  }
};