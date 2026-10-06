'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const experienceLinks = [
  { label: 'Hotels', href: '/admin/hotels', type: 'hotel' },
  { label: 'Restaurants', href: '/admin/restaurants', type: 'restaurant' },
  { label: 'Activities', href: '/admin/activities', type: 'activity' },
  { label: 'Attractions', href: '/admin/attractions', type: 'attraction' },
  { label: 'Events', href: '/admin/events', type: 'event' },
]

const ExperienceNavLinks: React.FC = () => {
  const pathname = usePathname()

  return (
    <div className="experience-nav-links">
      <style>{`
        .experience-nav-links {
          padding: 0 var(--base);
          margin-top: 16px;
        }
        .experience-nav-links__header {
          color: var(--theme-elevation-500);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 8px;
          padding: 0 12px;
          text-transform: uppercase;
        }
        .experience-nav-links__list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .experience-nav-links__item {
          margin: 2px 0;
        }
        .experience-nav-links__link {
          align-items: center;
          border-radius: 4px;
          color: var(--theme-elevation-800);
          display: flex;
          gap: 8px;
          padding: 8px 12px;
          text-decoration: none;
          transition: background-color 0.15s ease;
        }
        .experience-nav-links__link:hover {
          background-color: var(--theme-elevation-100);
        }
        .experience-nav-links__link--active {
          background-color: var(--theme-elevation-150);
          font-weight: 500;
        }
        .experience-nav-links__label {
          font-size: 13px;
        }
      `}</style>
      <div className="experience-nav-links__header">Experience Types</div>
      <ul className="experience-nav-links__list">
        {experienceLinks.map((link) => {
          const isActive = pathname === link.href

          return (
            <li key={link.href} className="experience-nav-links__item">
              <Link
                href={link.href}
                className={`experience-nav-links__link ${isActive ? 'experience-nav-links__link--active' : ''}`}
              >
                <span className="experience-nav-links__label">{link.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ExperienceNavLinks
