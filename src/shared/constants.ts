import { Privacy, ReactionType } from "@/types";

export const toBlobUrl = async(base64: string) => {
  const res = await fetch(base64)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob);
  return url
}

interface IReactionDefine {
  name: ReactionType;
  gif: string;
  color: string;
  icon: string;
}

export const REACTIONS: IReactionDefine[] = [
  {
    name: ReactionType.LIKE,
    icon: '/reactions-new/like.svg',
    gif: '/reactions-gif/like.gif',
    color: '#0084ff'
  },
  {
    name: ReactionType.LOVE,
    icon: '/reactions-new/love.svg',
    gif: '/reactions-gif/love.gif',
    color: '#f33e58'
  },
  {
    name: ReactionType.CARE,
    icon: '/reactions-new/care.svg',
    gif: '/reactions-gif/care.gif',
    color: '#f7b125'
  },
  {
    name: ReactionType.HAHA,
    icon: '/reactions-new/haha.svg',
    gif: '/reactions-gif/haha.gif',
    color: '#f7b125'
  },
  {
    name: ReactionType.WOW,
    icon: '/reactions-new/wow.svg',
    gif: '/reactions-gif/wow.gif',
    color: '#f7b125'
  },
  {
    name: ReactionType.SAD,
    icon: '/reactions-new/sad.svg',
    gif: '/reactions-gif/sad.gif',
    color: '#f7b125'
  },
  {
    name: ReactionType.ANGRY,
    icon: '/reactions-new/angry.svg',
    gif: '/reactions-gif/angry.gif',
    color: '#e9710f'
  }
]

export const STICKERS_URL  = 'https://cdn.jsdelivr.net/gh/naptestdev/zalo-stickers/data/favourite.json'

export const PrivacyOptions = [
  {
    icon: '/icons/privacy/public.png',
    text: 'Công khai',
    type: Privacy.PUBLIC
  },
  {
    icon: '/icons/privacy/friends.png',
    text: 'Bạn bè',
    type: Privacy.FRIENDS
  },
  {
    icon: '/icons/privacy/private.png',
    text: 'Riêng tư',
    type: Privacy.PRIVATE
  },
]