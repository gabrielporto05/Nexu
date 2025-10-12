import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ProfileNavigationContextData {
  currentProfileId: number | null
  navigateToProfile: (userId: number | null) => void
  navigateToOwnProfile: () => void
  isViewingOtherProfile: boolean
}

const ProfileNavigationContext = createContext<ProfileNavigationContextData>({} as ProfileNavigationContextData)

export const ProfileNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentProfileId, setCurrentProfileId] = useState<number | null>(null)

  const navigateToProfile = (userId: number | null) => {
    setCurrentProfileId(userId)
  }

  const navigateToOwnProfile = () => {
    setCurrentProfileId(null)
  }

  const isViewingOtherProfile = currentProfileId !== null

  return (
    <ProfileNavigationContext.Provider
      value={{
        currentProfileId,
        navigateToProfile,
        navigateToOwnProfile,
        isViewingOtherProfile
      }}
    >
      {children}
    </ProfileNavigationContext.Provider>
  )
}

export const useProfileNavigation = () => {
  const context = useContext(ProfileNavigationContext)
  if (!context) {
    throw new Error('useProfileNavigation must be used within a ProfileNavigationProvider')
  }
  return context
}
