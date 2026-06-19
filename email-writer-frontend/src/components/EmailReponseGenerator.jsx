import { useState } from 'react';

export default function EmailResponseGenerator() {
  const [emailText, setEmailText] = useState('');
  const [tone, setTone] = useState('professional');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateReply = async (e) => {
    e.preventDefault();

    if (!emailText.trim()) {
      setError('Please enter email content to generate a response.');
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('http://localhost:8080/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailContent: emailText, tone }),
      });

      if (!res.ok) throw new Error('Failed to generate response');

      const data = await res.text();
      if (isMounted) setResponse(data);
    } catch (err) {
      if (isMounted) setError('Unable to connect to server. Please check your backend.');
      console.error(err);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1280px',
      }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              color: '#2563eb',
              fontWeight: 'bold',
              fontSize: '24px'
            }}>✉️</div>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0
            }}>Email Response Writer</h1>
          </div>
          <p style={{
            fontSize: '1.125rem',
            color: '#4b5563',
            margin: 0
          }}>Generate professional email responses instantly with AI</p>
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          gridAutoFlow: 'dense'
        }}>

          {/* LEFT COLUMN - Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Email Input Card */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
            >
              <div style={{
                background: 'linear-gradient(to right, #eff6ff, #f1f5f9)',
                borderBottom: '1px solid #e5e7eb',
                padding: '1.5rem'
              }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0,
                  display: 'block'
                }}>Incoming Email</label>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <textarea
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  placeholder="Paste the email you want to reply to..."
                  style={{
                    width: '100%',
                    height: '224px',
                    padding: '1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    color: '#1f2937',
                    boxSizing: 'border-box',
                    resize: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.outline = 'none';
                    e.target.style.boxShadow = '0 0 0 3px #dbeafe';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{
                  marginTop: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#9ca3af'
                }}>
                  {emailText.length} {emailText.length === 1 ? 'character' : 'characters'}
                </div>
              </div>
            </div>

            {/* Controls Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              
              {/* Tone Selector */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'linear-gradient(to right, #eff6ff, #f1f5f9)',
                  borderBottom: '1px solid #e5e7eb',
                  padding: '1rem 1.5rem'
                }}>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0,
                    display: 'block'
                  }}>Tone</label>
                </div>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    background: 'white',
                    color: '#374151',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    fontWeight: '500',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '16px',
                    paddingRight: '2.5rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.boxShadow = 'inset 0 0 0 3px #dbeafe';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="urgent">Urgent</option>
                  <option value="grateful">Grateful</option>
                  <option value="formal">Formal</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateReply}
                disabled={loading || !emailText.trim()}
                style={{
                  background: loading || !emailText.trim() ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  fontWeight: '700',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  cursor: loading || !emailText.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  if (!loading && emailText.trim()) {
                    e.target.style.background = '#1d4ed8';
                    e.target.style.boxShadow = '0 4px 12px rgba(37,99,235,0.3)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && emailText.trim()) {
                    e.target.style.background = '#2563eb';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                                {loading ? (
                  <>
                    <span style={{
                      display: 'inline-block',
                      animation: 'spin 1s linear infinite',
                      width: '20px',
                      height: '20px'
                    }}>⏳</span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                gap: '0.75rem',
                animation: 'slideIn 0.3s ease-out'
              }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>⚠️</span>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#991b1b',
                    margin: '0 0 0.25rem 0'
                  }}>Error</h3>
                  <p style={{
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    margin: 0
                  }}>{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Output */}
          <div>
            {response ? (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: '500px'
              }}>
                
                {/* Email Header */}
                <div style={{
                  background: 'linear-gradient(to right, #eff6ff, #f1f5f9)',
                  borderBottom: '1px solid #e5e7eb',
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ color: '#16a34a', fontSize: '1.25rem' }}>✓</span>
                    <span style={{ fontWeight: '600', color: '#374151' }}>Generated Response</span>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    style={{
                      padding: '0.5rem 1rem',
                      background: copied ? '#e8f5e9' : '#f3f4f6',
                      border: `1px solid ${copied ? '#a5d6a7' : '#d1d5db'}`,
                      color: copied ? '#2e7d32' : '#374151',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    {copied ? 'Copied! ✓' : 'Copy Response'}
                  </button>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, whiteSpace: 'pre-wrap', color: '#1f2937' }}>
                  {response}
                </div>
              </div>
            ) : (
              <div style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                height: '100%',
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                padding: '2rem',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</span>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>No Response Generated Yet</h3>
                <p style={{ margin: 0, fontSize: '0.937rem' }}>Fill out the email text and hit generate to see your AI reply here.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
