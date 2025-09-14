export interface CommitteeInfo {
  id: string;
  committeeName: string;
  headOfCommittee: string;
  description: string;
  numberOfMember: number;
}

export interface CommitteeDetail {
  id: string;
  committeeName: string;
  description: string;
  headOfCommittee: string;
  viceHeadOfCommittee: string[];
}

export interface Target {
  id: number;
  title: string;
  expired: string;
  headDo: boolean;
  secretaryDo: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

export interface Task {
  label: string;
  items: {
    title: string;
    expired: string;
    percentComplete: number;
  }[];
}

export interface MemberOfCommittee {
  id: number;
  name: string;
  role: string;
  class: string;
  teams: string[];
  avatar?: string;
  lastActive?: string;
}
