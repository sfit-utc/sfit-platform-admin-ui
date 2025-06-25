export interface CommitteeInfo {
  id: number;
  committeeName: string;
  headOfCommittee: string;
  description: string;
  numberOfMember: number;
  href: string;
}

export interface CommitteeDetail {
  id: number;
  committeeName: string;
  description: string;
  headOfCommittee: string;
  viceHeadOfCommittee: string[];
}

export interface Target {
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
