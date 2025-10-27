'use client';

import { useState } from 'react';

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-[Inter]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          WJwiki 블로그 운영 정책 및 약관
        </h1>
        <p className="text-sm text-gray-600 mb-8 text-center">
          본 문서는 WJwiki (이하 &quot;블로그&quot;)의 운영자인 ProjectWJ이 블로그 서비스를 제공함에 있어
          개인정보 처리 방침 및 이용 약관을 규정합니다.
        </p>

        {/* Tab Navigation */}
        <nav
          className="flex justify-center border-b border-gray-300 mb-8"
          aria-label="Policy Tabs"
        >
          <button
            onClick={() => setActiveTab('privacy')}
            className={`tab-button text-lg px-6 py-3 rounded-t-lg focus:outline-none transition-colors ${
              activeTab === 'privacy'
                ? 'bg-blue-500 text-white font-semibold'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            role="tab"
            aria-selected={activeTab === 'privacy'}
            aria-controls="panel-privacy"
          >
            개인정보 처리 방침
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`tab-button text-lg px-6 py-3 rounded-t-lg focus:outline-none transition-colors ${
              activeTab === 'terms'
                ? 'bg-blue-500 text-white font-semibold'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            role="tab"
            aria-selected={activeTab === 'terms'}
            aria-controls="panel-terms"
          >
            이용 약관
          </button>
        </nav>

        {/* Tab Content */}
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md">
          {activeTab === 'privacy' && (
            <section id="panel-privacy" role="tabpanel" aria-labelledby="tab-privacy">
              <h2 className="text-xl font-semibold mb-3">1. 개인정보 처리 방침 (Privacy Policy)</h2>
              <p className="mb-4">
                WJwiki 블로그는 이용자의 개인정보를 소중히 여기며, 관련 법령을 준수합니다. 본 블로그는 댓글 기능 등 이용자로부터 직접적인 정보를 수집하는 기능을 제공하지 않으므로, 정보 수집을 최소화하고 있습니다.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">1.1 수집하는 정보의 종류 및 목적</h3>
              <p className="mb-4">
                본 블로그는 서비스 운영 및 보안 목적을 위해 다음과 같은 정보를 수집하고 이용합니다.
              </p>

              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse mb-4">
                  <thead>
                    <tr>
                      <th className="border border-gray-200 bg-gray-100 p-3 text-left font-semibold">
                        수집 항목
                      </th>
                      <th className="border border-gray-200 bg-gray-100 p-3 text-left font-semibold">
                        수집 목적
                      </th>
                      <th className="border border-gray-200 bg-gray-100 p-3 text-left font-semibold">
                        보유 및 이용 기간
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-3 font-medium">
                        비식별 트래픽 데이터
                      </td>
                      <td className="border border-gray-200 p-3">
                        서비스 성능 측정 및 개선 (Vercel Speed Insights)
                      </td>
                      <td className="border border-gray-200 p-3">
                        데이터 제공 서비스의 정책에 따름
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3 font-medium">
                        관리자 로그인 시도 정보 (IP 주소, 브라우저 정보)
                      </td>
                      <td className="border border-gray-200 p-3">
                        서비스의 보안 강화, 비정상적인 접근 차단 및 무단 침입 방어
                      </td>
                      <td className="border border-gray-200 p-3">
                        보안상 필요하다고 판단될 때까지 일시적 보존 후 파기
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-2">1.2 쿠키(Cookies) 운영에 관한 사항</h3>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>
                  본 블로그는 서비스 개선 및 트래픽 분석을 위해{' '}
                  <strong>Vercel Speed Insights</strong>와 같은 제3자 분석 도구를 사용하며, 이 과정에서{' '}
                  <strong>개인을 식별할 수 없는 최소한의 쿠키</strong>가 사용될 수 있습니다.
                </li>
                <li>
                  이 쿠키는 블로그 운영에 필수적인 기능이나 사용자 경험 개선을 위한 통계적 목적으로만 사용됩니다.
                </li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-2">1.3 개인정보 보호 담당자</h3>
              <p className="mb-3">
                귀하의 개인정보를 보호하고 개인정보와 관련한 의견을 처리하기 위하여 아래 연락처를 이용하시기 바랍니다.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>성명:</strong> ProjectWJ
                </li>
                <li>
                  <strong>연락처 (이메일):</strong> projectwj@proton.me
                </li>
              </ul>
            </section>
          )}

          {activeTab === 'terms' && (
            <section id="panel-terms" role="tabpanel" aria-labelledby="tab-terms">
              <h2 className="text-xl font-semibold mb-3">2. 이용 약관 (Terms of Service)</h2>
              <p className="mb-4">본 약관은 WJwiki 블로그를 이용하는 모든 이용자에게 적용됩니다.</p>

              <h3 className="text-lg font-semibold mt-6 mb-2">2.1 블로그 콘텐츠의 저작권</h3>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>
                  블로그에 게시된 모든 콘텐츠(텍스트, 이미지, SVG, 코드 등)에 대한 저작권은 별도로 명시하지 않는 한{' '}
                  <strong>운영자(ProjectWJ)</strong>에게 있습니다.
                </li>
                <li>
                  단, 외부에서 합법적으로 다운로드하여 사용한 매체(이미지, 폰트, 코드 스니펫 등)의 저작권은 해당 원저작자에게 있으며, 본 블로그는 원래의 라이선스(CC BY 4.0 등)를 준수합니다.
                </li>
                <li>
                  또한, 운영자가 가공한 디자인 요소 중 일부에는 <strong>CC BY 4.0</strong> 라이선스가 적용됩니다. (푸터에 별도 명시)
                </li>
                <li>
                  운영자의 사전 서면 동의 없이 콘텐츠의 무단 복제, 배포, 2차 가공 및 상업적 이용을 금지합니다.
                </li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-2">2.2 이용자의 의무</h3>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>
                  이용자는 블로그의 정상적인 운영을 방해하거나, 불법적이거나 악의적인 목적으로 블로그를 이용해서는 안 됩니다.
                </li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-2">2.3 면책 조항</h3>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>
                  본 블로그의 게시물은 운영자의 개인적 의견 또는 참고 자료이며, 정보의 정확성이나 신뢰성에 대해 보증하지 않습니다.
                </li>
                <li>
                  이용자가 본 정보를 신뢰하여 발생한 손해에 대해 운영자는 책임을 지지 않습니다.
                </li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-2">2.4 정책 및 약관의 변경</h3>
              <p className="mb-4">
                본 정책 및 약관은 관련 법령 및 서비스 변경에 따라 수정될 수 있으며, 변경 사항은 블로그를 통해 공지합니다.
              </p>

              <hr className="border-gray-200 my-6" />

              <p className="text-sm text-gray-500">
                <strong>본 정책 및 약관은 2025년 10월 27일부터 시행됩니다.</strong>
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
