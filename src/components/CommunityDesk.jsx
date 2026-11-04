import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { RoomGrid } from './RoomGrid';
import { ArchitectureBoard } from './ArchitectureBoard';
import { BreezePlant } from './BreezePlant';
import { Folder } from './Folder';
import { MemberBadge } from './MemberBadge';
import { LinksComputer } from './LinksComputer';
import { IpodPlayer } from './IpodPlayer';
import { PeelSticker } from './PeelSticker';
import { QuoteCalculator } from './QuoteCalculator';
import { DevToolsBox } from './DevToolsBox';
import { ProjectShipLog } from './ProjectShipLog';
import { DiscordKeyring } from './DiscordKeyring';
import { DeskMascot } from './DeskMascot';
import { FullscreenModal } from './FullscreenModal';
import { useWinDrag } from '../hooks/useWinDrag';
import { usePaperScrunch } from '../hooks/usePaperScrunch';
import { DESK_CARDS, DESK_ELEMENTS } from '../data/portfolioData';

// Glyph renderer for the menu rows
function MenuRowIcon({ cardKey }) {
  if (cardKey === 'bio' || cardKey === 'perks') {
    return (
      <svg className="cdesk__glyph" viewBox="0 0 20 20" aria-hidden="true">
        <text x="10" y="15" textAnchor="middle" className="cdesk__glyph-m">
          R
        </text>
      </svg>
    );
  }
  const card = DESK_CARDS.find((c) => c.key === cardKey);
  if (card?.iconSrc) {
    return <img className="cdesk__glyph-img" src={card.iconSrc} alt="" draggable={false} />;
  }
  return null;
}

export function CommunityDesk() {
  const { scrunchState } = usePaperScrunch();

  // Keep windows closed initially on page load/refresh as requested
  const [showMenu, setShowMenu] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [detailClosing, setDetailClosing] = useState(false);
  const [cascade, setCascade] = useState(false);
  const [activeKey, setActiveKey] = useState(DESK_CARDS[0].key);
  const [gridPadding, setGridPadding] = useState(0);
  const [fullscreenItem, setFullscreenItem] = useState(null);

  const deskRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, scrollX: 0, scrollY: 0, moved: false });
  const closeTimerRef = useRef(null);

  const menuDrag = useWinDrag();
  const detailDrag = useWinDrag();

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  // Open detail window for an item
  const openItem = (key) => {
    clearCloseTimer();
    setCascade(!showMenu || menuClosing);
    setMenuClosing(false);
    setDetailClosing(false);
    setActiveKey(key);
    setShowMenu(true);
    setShowDetail(true);
  };

  // Open menu directory window
  const openMenuWindow = () => {
    clearCloseTimer();
    setMenuClosing(false);
    if (detailClosing) {
      setShowDetail(false);
      setDetailClosing(false);
    }
    setShowMenu(true);
  };

  // Close both windows
  const closeAllWindows = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowMenu(false);
      setShowDetail(false);
      return;
    }
    setMenuClosing(true);
    setDetailClosing(true);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setShowMenu(false);
      setShowDetail(false);
      setMenuClosing(false);
      setDetailClosing(false);
    }, 200);
  };

  // Close only detail window
  const closeDetailWindow = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowDetail(false);
      return;
    }
    setDetailClosing(true);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setShowDetail(false);
      setDetailClosing(false);
    }, 200);
  };

  // Fullscreen modal handler
  const openFullscreen = (item) => {
    setFullscreenItem(item);
  };

  const closeFullscreen = () => {
    setFullscreenItem(null);
  };

  // Cascade layout adjustment for desktop windows
  useLayoutEffect(() => {
    if (!showDetail) return;
    const menuEl = menuDrag.elRef.current;
    const detailEl = detailDrag.elRef.current;
    if (!detailEl) return;

    if (window.innerWidth <= 900) {
      return;
    }

    if (menuEl && showMenu) {
      detailDrag.reset();
      const rightEdge = menuEl.offsetLeft + menuEl.offsetWidth + menuDrag.pos.current.x + 16;
      const bottomEdge = menuEl.offsetTop + menuEl.offsetHeight + menuDrag.pos.current.y;
      const clampLeft = Math.min(rightEdge, window.innerWidth - 16 - detailEl.offsetWidth);
      const clampBottom = Math.max(window.innerHeight - bottomEdge, 16);

      detailEl.style.left = `${Math.max(16, clampLeft)}px`;
      detailEl.style.bottom = `${clampBottom}px`;
      detailEl.style.top = 'auto';
    } else {
      detailDrag.reset();
      detailEl.style.left = `${Math.max(16, (window.innerWidth - detailEl.offsetWidth) / 2)}px`;
      detailEl.style.bottom = '12vh';
      detailEl.style.top = 'auto';
    }
  }, [showDetail, showMenu, activeKey]);

  // Window resize & responsive desk scaling: ensure the entire 1512x881 desk fits completely!
  useEffect(() => {
    const el = deskRef.current;
    if (!el) return;

    const handleResize = () => {
      // Scale based on both dimensions so nothing is cropped or hidden
      const scale = Math.min(window.innerWidth / 1512, window.innerHeight / 881);
      el.style.setProperty('--s', String(scale));
      el.classList.toggle('cdesk--pannable', 1512 * scale > window.innerWidth);
      setGridPadding(Math.max(0, Math.ceil((window.innerWidth / scale - 1512) / 2)));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Center desk horizontally on mount
  useEffect(() => {
    const el = deskRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
  }, []);

  // Keyboard navigation: Escape key closes active window/modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (fullscreenItem) {
          closeFullscreen();
        } else {
          closeAllWindows();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenItem]);

  const activeCard = DESK_CARDS.find((c) => c.key === activeKey) || DESK_CARDS[0];

  return (
    <>
      {/* SVG Ink Swap Filter */}
      <svg className="cdesk__filters" aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="cdesk-ink-swap" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="linear" slope="-1" intercept={277 / 255} />
            <feFuncG type="linear" slope="-1" intercept={274 / 255} />
            <feFuncB type="linear" slope="-1" intercept={269 / 255} />
          </feComponentTransfer>
        </filter>
      </svg>

      {/* Paper Stop-Motion Crumple/Fold Shade Overlay */}
      {scrunchState !== 'idle' && (
        <div
          className={`paper-stopmo-shade paper-stopmo-shade--${scrunchState}`}
          aria-hidden="true"
        />
      )}

      {/* Main Pannable / Scaled Desk Workspace */}
      <div
        ref={deskRef}
        className={`cdesk${scrunchState === 'in' ? ' paper-scrunch-in' : scrunchState === 'out' ? ' paper-scrunch-out' : ''}`}
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}
        onPointerDown={(e) => {
          const el = deskRef.current;
          if (!el || e.pointerType !== 'mouse' || e.button !== 0 || el.scrollWidth <= el.clientWidth) return;
          dragRef.current = {
            active: true,
            startX: e.clientX,
            startY: e.clientY,
            scrollX: el.scrollLeft,
            scrollY: el.scrollTop,
            moved: false
          };
        }}
        onPointerMove={(e) => {
          const el = deskRef.current;
          if (!el || !dragRef.current.active) return;
          const dx = e.clientX - dragRef.current.startX;
          if (Math.abs(dx) > 5) dragRef.current.moved = true;
          el.scrollLeft = dragRef.current.scrollX - dx;
        }}
        onPointerUp={() => {
          dragRef.current.active = false;
        }}
        onClickCapture={(e) => {
          if (dragRef.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            dragRef.current.moved = false;
          }
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="cdesk__scale">
          {/* Isometric Background Perspective Floor Grid */}
          <div className="cdesk__bg" aria-hidden="true">
            <RoomGrid pad={gridPadding} />
          </div>

          {/* Desk Surface Interactive Items Stage */}
          <div className="cdesk__stage">
            {DESK_ELEMENTS.map((elem) => {
              const itemStyle = {
                left: `${elem.left}%`,
                top: `${elem.top}%`,
                width: `${elem.width}%`,
                ...(elem.clip ? { clipPath: elem.clip } : {})
              };

              // Interactive Developer Sticky Note / Sticker
              if (elem.key === 'sticker') {
                return (
                  <span key={elem.key} className="cdesk__item" style={itemStyle}>
                    <PeelSticker src="/images/dev-sticker.svg?v=9" alt="DEV Mode Developer Sticky Note" />
                  </span>
                );
              }

              // Interactive Desk Companion Mascot (Cursor-tracking Penguin)
              if (elem.key === 'mascot') {
                return (
                  <span
                    key={elem.key}
                    className="cdesk__item"
                    style={{ ...itemStyle, zIndex: 10, pointerEvents: 'none' }}
                  >
                    <DeskMascot size={116} />
                  </span>
                );
              }

              // Discord / GitHub Keyring
              if (elem.key === 'keyring') {
                return (
                  <DiscordKeyring
                    key={elem.key}
                    label={elem.alt}
                    style={itemStyle}
                    onClick={() => openItem('socials')}
                    ambient={true}
                  />
                );
              }

              let nodeContent = null;
              if (elem.key === 'plant') {
                nodeContent = <BreezePlant />;
              } else if (elem.key === 'folder') {
                nodeContent = <Folder labelTop="PROJECTS" labelBottom="WORK" ambient={true} onClick={() => openItem('projects')} />;
              } else if (elem.key === 'calc') {
                nodeContent = <QuoteCalculator ambient={true} onClick={() => openItem('benchmarks')} />;
              } else if (elem.key === 'badge') {
                nodeContent = (
                  <MemberBadge
                    blank={false}
                    name="Rajveer Singh"
                    jobTitle="Full-Stack Developer | AI/ML"
                    handle="@shashwat-28410"
                    email="iamrajveer28@gmail.com"
                    orgName="Newton School of Technology"
                    ambient={true}
                    onClick={() => openItem('bio')}
                  />
                );
              } else if (elem.key === 'computer') {
                nodeContent = (
                  <LinksComputer
                    art={{
                      base: '/_next/static/media/links-base.0oasckv.81t9b.svg',
                      mouse: '/_next/static/media/links-mouse.0qz4n_pe17pwl.svg'
                    }}
                    ambient={true}
                    onClick={() => openItem('tech-stack')}
                  />
                );
              } else if (elem.key === 'ipod') {
                nodeContent = <IpodPlayer onMenu={openMenuWindow} />;
              } else if (elem.key === 'board') {
                nodeContent = (
                  <ArchitectureBoard
                    pivotX={elem.pin?.x || 45.98}
                    pivotY={elem.pin?.y || 3.07}
                    ambient={true}
                    onClick={() => openItem('architecture')}
                  />
                );
              } else if (elem.key === 'bag') {
                nodeContent = (
                  <DevToolsBox
                    ambient={true}
                    onClick={() => openItem('open-source')}
                  />
                );
              } else if (elem.key === 'events') {
                nodeContent = (
                  <ProjectShipLog
                    ambient={true}
                    onClick={() => openItem('ship-log')}
                  />
                );
              } else if (elem.src) {
                nodeContent = <img src={elem.src} alt={elem.alt} draggable={false} />;
              }

              // Decorative non-clickable item
              if (elem.deco) {
                return (
                  <span
                    key={elem.key}
                    className="cdesk__item cdesk__item--deco"
                    style={{ ...itemStyle, zIndex: elem.key === 'ipod' ? 20 : undefined }}
                  >
                    {nodeContent}
                  </span>
                );
              }

              // Press Button (Contact / Hire Me)
              if (elem.key === 'press') {
                return (
                  <a
                    key={elem.key}
                    className="cdesk__item cdesk__item--link"
                    style={itemStyle}
                    href="#contact"
                    aria-label={elem.alt}
                    onClick={(e) => {
                      e.preventDefault();
                      openItem('bio');
                    }}
                  >
                    {nodeContent}
                    <span
                      className="cdesk__press-ball"
                      aria-hidden="true"
                      style={{
                        backgroundImage: 'url(/_next/static/media/login.15w0k3qz6y3f9.svg)',
                        backgroundSize: '276% auto',
                        backgroundPosition: '49.7% 51.3%'
                      }}
                    />
                  </a>
                );
              }

              // Clickable Desk Item Button
              return (
                <button
                  key={elem.key}
                  type="button"
                  className={`cdesk__item cdesk__item--link${elem.key === 'badge' ? ' cdesk__item--badge' : ''}`}
                  style={itemStyle}
                  aria-label={elem.alt}
                  onClick={() => openItem(elem.item)}
                >
                  {nodeContent}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Retro OS Draggable Windows */}
      {(showMenu || showDetail) && (
        <div className="cdesk__windows">
          {/* Detail Window */}
          {showDetail && (
            <section
              className={`cdesk__win cdesk__detail${cascade ? ' cdesk__detail--cascade' : ''}${detailClosing ? ' is-closing' : ''}`}
              role="dialog"
              aria-label={activeCard.window.title}
              ref={detailDrag.setEl}
            >
              <header className="cdesk__win-bar cdesk__win-bar--dark" onPointerDown={detailDrag.onBarPointerDown} style={{ cursor: 'grab' }}>
                <span className="cdesk__win-title cdesk__win-title--serif">
                  {activeCard.window.title}{' '}
                  <img className="cdesk__hand" src="/_next/static/media/hand.0_ck3fufrsi-k.svg" alt="" draggable={false} />
                </span>

                <span className="cdesk__win-glyphs" aria-hidden="true">
                  <svg className="cdesk__ctl" viewBox="0 0 13 13">
                    <line x1="1" y1="11.6" x2="12" y2="11.6" />
                  </svg>
                </span>

                {/* Maximize to full page modal button */}
                <button
                  type="button"
                  className="cdesk__win-max"
                  aria-label="Open the full page"
                  onClick={() => openFullscreen(activeCard)}
                >
                  <svg className="cdesk__ctl" viewBox="0 0 13 13">
                    <rect x="1.6" y="1.6" width="9.8" height="9.8" />
                  </svg>
                </button>

                {/* Close detail window button */}
                <button
                  type="button"
                  className="cdesk__win-x"
                  aria-label="Close window"
                  onClick={closeDetailWindow}
                >
                  <svg className="cdesk__ctl" viewBox="0 0 13 13">
                    <line x1="2" y1="2" x2="11" y2="11" />
                    <line x1="11" y1="2" x2="2" y2="11" />
                  </svg>
                </button>
              </header>

              <div className="cdesk__detail-body">
                <h2 className="cdesk__detail-heading">{activeCard.window.heading}</h2>

                {activeCard.window.body.map((p, idx) => (
                  <p key={idx} className="cdesk__detail-copy">
                    {p}
                  </p>
                ))}

                {activeCard.window.image && (
                  <div
                    style={{
                      margin: '16px 0',
                      border: '1.5px solid #212121',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '3px 4px 0px rgba(33, 33, 33, 0.65)'
                    }}
                  >
                    <img
                      src={activeCard.window.image}
                      alt="Developer Meme"
                      draggable={false}
                      style={{ width: '100%', height: 'auto', maxHeight: '220px', objectFit: 'contain', display: 'block', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                )}

                {activeCard.window.shout && (
                  <p className="cdesk__detail-shout">{activeCard.window.shout}</p>
                )}

                {activeCard.window.bulletsIntro && (
                  <p className="cdesk__detail-bullets-intro">{activeCard.window.bulletsIntro}</p>
                )}

                {activeCard.window.bullets && (
                  <ul className="cdesk__detail-bullets">
                    {activeCard.window.bullets.map((b, idx) => (
                      <li key={idx}>
                        <span className="cdesk__bullet-tick" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <footer className="cdesk__detail-foot">
                <button
                  type="button"
                  className="cdesk__btn cdesk__btn--mint"
                  onClick={() => openFullscreen(activeCard)}
                >
                  Full Case Study &amp; Details →
                </button>
                <a
                  className="cdesk__btn"
                  href="mailto:iamrajveer28@gmail.com"
                >
                  Hire Me / Email
                </a>
              </footer>
            </section>
          )}

          {/* Directory Menu Window */}
          {showMenu && (
            <section
              className={`cdesk__win cdesk__menu${menuClosing ? ' is-closing' : ''}`}
              role="dialog"
              aria-label="Workspace Directory"
              ref={menuDrag.setEl}
            >
              <header className="cdesk__win-bar" onPointerDown={menuDrag.onBarPointerDown} style={{ cursor: 'grab' }}>
                <span className="cdesk__win-title">PROJECT DIRECTORY</span>
                <span className="cdesk__win-glyphs" aria-hidden="true">
                  <svg className="cdesk__ctl" viewBox="0 0 13 13">
                    <line x1="1" y1="11.6" x2="12" y2="11.6" />
                  </svg>
                  <svg className="cdesk__ctl" viewBox="0 0 13 13">
                    <rect x="1.6" y="1.6" width="9.8" height="9.8" />
                  </svg>
                </span>
                <button
                  type="button"
                  className="cdesk__win-x"
                  aria-label="Close menu"
                  onClick={closeAllWindows}
                >
                  <svg className="cdesk__ctl" viewBox="0 0 13 13">
                    <line x1="2" y1="2" x2="11" y2="11" />
                    <line x1="11" y1="2" x2="2" y2="11" />
                  </svg>
                </button>
              </header>

              <p className="cdesk__menu-includes" aria-hidden="true">
                <img className="cdesk__hand" src="/_next/static/media/hand.0_ck3fufrsi-k.svg" alt="" draggable={false} />
                {' '}PROJECTS &amp; WORK{' '}
                <img className="cdesk__hand" src="/_next/static/media/hand.0_ck3fufrsi-k.svg" alt="" draggable={false} />
              </p>

              <ul className="cdesk__menu-list">
                {DESK_CARDS.map((card) => (
                  <li key={card.key}>
                    <button
                      type="button"
                      className={`cdesk__menu-row${activeKey === card.key && showDetail ? ' is-selected' : ''}`}
                      onClick={() => {
                        clearCloseTimer();
                        setCascade(false);
                        setMenuClosing(false);
                        setDetailClosing(false);
                        setActiveKey(card.key);
                        setShowDetail(true);
                      }}
                    >
                      <span className="cdesk__menu-ic">
                        <MenuRowIcon cardKey={card.key} />
                      </span>
                      <span className="cdesk__menu-label">{card.label}</span>
                      <span className="cdesk__menu-arrow" aria-hidden="true">
                        ▸
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <footer className="cdesk__menu-cta">
                <a
                  className="cdesk__btn cdesk__btn--mint"
                  href="mailto:iamrajveer28@gmail.com"
                >
                  Hire Rajveer →
                </a>
                <button
                  type="button"
                  className="cdesk__btn"
                  onClick={() => openItem('bio')}
                >
                  About Me
                </button>
              </footer>
            </section>
          )}
        </div>
      )}



      {/* Maximized Fullscreen Retro Window Overlay */}
      {fullscreenItem && (
        <FullscreenModal activeItem={fullscreenItem} onClose={closeFullscreen} />
      )}
    </>
  );
}
