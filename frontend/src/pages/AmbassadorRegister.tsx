import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Phone, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { getApiUrl } from '../config/api';

const AmbassadorRegister: React.FC = () => {
  const [step, setStep] = useState(1); // Step 1: Email/Password, Step 2: Phone, Step 3: Verification
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    countryCode: '+1'
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ambassadorId, setAmbassadorId] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checksum, setChecksum] = useState('');
  const [codeExpiresIn, setCodeExpiresIn] = useState('');
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Step 1: Register with email/password
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Attempting registration with:', formData.email);
      const response = await fetch(getApiUrl('/api/ambassadors/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAmbassadorId(data.ambassadorId);
        toast.success('Account created! Please verify your phone number.');
        setStep(2);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Send verification code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    
    try {
      const fullPhoneNumber = formData.countryCode + formData.phoneNumber;
      const response = await fetch(getApiUrl('/api/ambassadors/send-verification-code'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ambassadorId: ambassadorId,
          phoneNumber: fullPhoneNumber
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setChecksum(data.checksum);
        setCodeExpiresIn(data.codeExpiresIn);
        toast.success(`Verification code sent to ${data.phoneNumber}`);
        setStep(3);
      } else {
        toast.error(data.message || 'Failed to send verification code');
      }
    } catch (error: any) {
      console.error('Error sending code:', error);
      toast.error(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(getApiUrl('/api/ambassadors/verify-phone'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ambassadorId: ambassadorId,
          code: verificationCode,
          userEnteredCode: verificationCode
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Phone verified successfully!');
        // Store token and navigate (using same keys as AuthContext)
        localStorage.setItem('ambassadorToken', data.token);
        localStorage.setItem('ambassador', JSON.stringify(data.ambassador));
        navigate('/ambassador/dashboard');
      } else {
        toast.error(data.message || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    
    try {
      const fullPhoneNumber = formData.countryCode + formData.phoneNumber;
      const response = await fetch(getApiUrl('/api/ambassadors/send-verification-code'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ambassadorId: ambassadorId,
          phoneNumber: fullPhoneNumber
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setChecksum(data.checksum);
        setCodeExpiresIn(data.codeExpiresIn);
        toast.success('New verification code sent');
      } else {
        toast.error(data.message || 'Failed to resend code');
      }
    } catch (error: any) {
      console.error('Error resending code:', error);
      toast.error(error.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            {step === 1 ? (
              <User className="w-8 h-8" />
            ) : step === 2 ? (
              <Phone className="w-8 h-8" />
            ) : (
              <Shield className="w-8 h-8" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {step === 1 ? 'Create Ambassador Account' : step === 2 ? 'Verify Your Phone' : 'Enter Verification Code'}
          </h2>
          <p className="mt-2 text-gray-600">
            {step === 1 ? 'Join Elsa Fashionis collaboration program' : 
             step === 2 ? 'Enter your phone number to receive a verification code' :
             'Enter the 6-digit code sent to your phone'}
          </p>
        </div>

        {/* Step 1: Email and Password */}
        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleStep1Submit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Verify your phone number</li>
                <li>• Complete your clearance form</li>
                <li>• Pay $2 clearance fee</li>
                <li>• Select 3 free outfits</li>
                <li>• Start creating content</li>
              </ul>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Continue'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/ambassador/login"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* Step 2: Phone Number */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleSendCode}>
            <div className="space-y-4">
              <div>
                <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Country Code
                </label>
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="input-field w-full"
                >
                  <option value="+1">🇺🇸 United States (+1)</option>
                  <option value="+44">🇬🇧 United Kingdom (+44)</option>
                  <option value="+1">🇨🇦 Canada (+1)</option>
                  <option value="+61">🇦🇺 Australia (+61)</option>
                  <option value="+49">🇩🇪 Germany (+49)</option>
                  <option value="+33">🇫🇷 France (+33)</option>
                  <option value="+39">🇮🇹 Italy (+39)</option>
                  <option value="+34">🇪🇸 Spain (+34)</option>
                  <option value="+91">🇮🇳 India (+91)</option>
                  <option value="+86">🇨🇳 China (+86)</option>
                  <option value="+81">🇯🇵 Japan (+81)</option>
                  <option value="+55">🇧🇷 Brazil (+55)</option>
                  <option value="+52">🇲🇽 Mexico (+52)</option>
                  <option value="+27">🇿🇦 South Africa (+27)</option>
                  <option value="+234">🇳🇬 Nigeria (+234)</option>
                  <option value="+7">🇷🇺 Russia (+7)</option>
                  <option value="+82">🇰🇷 South Korea (+82)</option>
                  <option value="+65">🇸🇬 Singapore (+65)</option>
                  <option value="+971">🇦🇪 UAE (+971)</option>
                  <option value="+966">🇸🇦 Saudi Arabia (+966)</option>
                  <option value="+31">🇳🇱 Netherlands (+31)</option>
                  <option value="+46">🇸🇪 Sweden (+46)</option>
                  <option value="+47">🇳🇴 Norway (+47)</option>
                  <option value="+45">🇩🇰 Denmark (+45)</option>
                  <option value="+358">🇫🇮 Finland (+358)</option>
                  <option value="+41">🇨🇭 Switzerland (+41)</option>
                  <option value="+43">🇦🇹 Austria (+43)</option>
                  <option value="+32">🇧🇪 Belgium (+32)</option>
                  <option value="+351">🇵🇹 Portugal (+351)</option>
                  <option value="+30">🇬🇷 Greece (+30)</option>
                  <option value="+90">🇹🇷 Turkey (+90)</option>
                  <option value="+48">🇵🇱 Poland (+48)</option>
                  <option value="+420">🇨🇿 Czech Republic (+420)</option>
                  <option value="+36">🇭🇺 Hungary (+36)</option>
                  <option value="+40">🇷🇴 Romania (+40)</option>
                  <option value="+359">🇧🇬 Bulgaria (+359)</option>
                  <option value="+381">🇷🇸 Serbia (+381)</option>
                  <option value="+385">🇭🇷 Croatia (+385)</option>
                  <option value="+386">🇸🇮 Slovenia (+386)</option>
                  <option value="+371">🇱🇻 Latvia (+371)</option>
                  <option value="+370">🇱🇹 Lithuania (+370)</option>
                  <option value="+372">🇪🇪 Estonia (+372)</option>
                  <option value="+353">🇮🇪 Ireland (+353)</option>
                  <option value="+352">🇱🇺 Luxembourg (+352)</option>
                  <option value="+358">🇮🇸 Iceland (+354)</option>
                  <option value="+356">🇲🇹 Malta (+356)</option>
                  <option value="+376">🇦🇩 Andorra (+376)</option>
                  <option value="+377">🇲🇨 Monaco (+377)</option>
                  <option value="+378">🇸🇲 San Marino (+378)</option>
                  <option value="+350">🇬🇮 Gibraltar (+350)</option>
                  <option value="+351">🇵🇹 Portugal (+351)</option>
                  <option value="+380">🇺🇦 Ukraine (+380)</option>
                  <option value="+375">🇧🇾 Belarus (+375)</option>
                  <option value="+373">🇲🇩 Moldova (+373)</option>
                  <option value="+374">🇦🇲 Armenia (+374)</option>
                  <option value="+994">🇦🇿 Azerbaijan (+994)</option>
                  <option value="+995">🇬🇪 Georgia (+995)</option>
                  <option value="+998">🇺🇿 Uzbekistan (+998)</option>
                  <option value="+996">🇰🇬 Kyrgyzstan (+996)</option>
                  <option value="+993">🇹🇯 Tajikistan (+993)</option>
                  <option value="+992">🇹🇲 Turkmenistan (+992)</option>
                  <option value="+7">🇰🇿 Kazakhstan (+7)</option>
                  <option value="+855">🇰🇭 Cambodia (+855)</option>
                  <option value="+84">🇻🇳 Vietnam (+84)</option>
                  <option value="+66">🇹🇭 Thailand (+66)</option>
                  <option value="+60">🇲🇾 Malaysia (+60)</option>
                  <option value="+62">🇮🇩 Indonesia (+62)</option>
                  <option value="+63">🇵🇭 Philippines (+63)</option>
                  <option value="+64">🇳🇿 New Zealand (+64)</option>
                  <option value="+675">🇵🇬 Papua New Guinea (+675)</option>
                  <option value="+679">🇫🇯 Fiji (+679)</option>
                  <option value="+685">🇼🇸 Samoa (+685)</option>
                  <option value="+682">🇨🇰 Cook Islands (+682)</option>
                  <option value="+681">🇳🇺 Niue (+681)</option>
                  <option value="+687">🇻🇺 Vanuatu (+687)</option>
                  <option value="+689">🇵🇫 French Polynesia (+689)</option>
                  <option value="+683">🇹🇰 Tokelau (+683)</option>
                  <option value="+686">🇰🇮 Kiribati (+686)</option>
                  <option value="+688">🇳🇷 Nauru (+688)</option>
                  <option value="+690">🇹🇻 Tuvalu (+690)</option>
                  <option value="+691">🇫🇲 Micronesia (+691)</option>
                  <option value="+692">🇲🇭 Marshall Islands (+692)</option>
                  <option value="+673">🇧🇳 Brunei (+673)</option>
                  <option value="+674">🇳🇷 Nauru (+674)</option>
                  <option value="+676">🇹🇴 Tonga (+676)</option>
                  <option value="+677">🇸🇧 Solomon Islands (+677)</option>
                  <option value="+678">🇻🇺 Vanuatu (+678)</option>
                  <option value="+680">🇵🇼 Palau (+680)</option>
                  <option value="+684">🇼🇫 Wallis and Futuna (+684)</option>
                  <option value="+687">🇻🇺 Vanuatu (+687)</option>
                  <option value="+688">🇳🇷 Nauru (+688)</option>
                  <option value="+689">🇵🇫 French Polynesia (+689)</option>
                  <option value="+690">🇹🇻 Tuvalu (+690)</option>
                  <option value="+691">🇫🇲 Micronesia (+691)</option>
                  <option value="+692">🇲🇭 Marshall Islands (+692)</option>
                  <option value="+850">🇰🇵 North Korea (+850)</option>
                  <option value="+852">🇭🇰 Hong Kong (+852)</option>
                  <option value="+853">🇲🇴 Macau (+853)</option>
                  <option value="+886">🇹🇼 Taiwan (+886)</option>
                  <option value="+880">🇧🇩 Bangladesh (+880)</option>
                  <option value="+92">🇵🇰 Pakistan (+92)</option>
                  <option value="+93">🇦🇫 Afghanistan (+93)</option>
                  <option value="+94">🇱🇰 Sri Lanka (+94)</option>
                  <option value="+95">🇲🇲 Myanmar (+95)</option>
                  <option value="+960">🇲🇻 Maldives (+960)</option>
                  <option value="+961">🇱🇧 Lebanon (+961)</option>
                  <option value="+962">🇯🇴 Jordan (+962)</option>
                  <option value="+963">🇸🇾 Syria (+963)</option>
                  <option value="+964">🇮🇶 Iraq (+964)</option>
                  <option value="+965">🇰🇼 Kuwait (+965)</option>
                  <option value="+966">🇸🇦 Saudi Arabia (+966)</option>
                  <option value="+967">🇾🇪 Yemen (+967)</option>
                  <option value="+968">🇴🇲 Oman (+968)</option>
                  <option value="+970">🇵🇸 Palestine (+970)</option>
                  <option value="+971">🇦🇪 UAE (+971)</option>
                  <option value="+972">🇮🇱 Israel (+972)</option>
                  <option value="+973">🇧🇭 Bahrain (+973)</option>
                  <option value="+974">🇶🇦 Qatar (+974)</option>
                  <option value="+975">🇧🇹 Bhutan (+975)</option>
                  <option value="+976">🇲🇳 Mongolia (+976)</option>
                  <option value="+977">🇳🇵 Nepal (+977)</option>
                </select>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  A 6-digit verification code will be sent to {formData.countryCode} {formData.phoneNumber}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Phone Verification</h4>
              <p className="text-sm text-blue-700">
                A Google verification code will be sent to your phone via SMS. This helps us verify your identity and keep your account secure.
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Back
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Verification Code */}
        {step === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
            <div className="space-y-4">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="input-field pl-10 text-center text-2xl tracking-widest"
                    placeholder="000000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-digit code sent to {formData.phoneNumber}
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-700">
                  Code expires in: <span className="font-semibold">{codeExpiresIn}</span>
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </div>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center mx-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-gray-600 hover:text-gray-900 font-medium block mx-auto"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <Link
            to="/elsa-collab"
            className="text-gray-500 hover:text-gray-700 text-sm inline-flex items-center"
          >
            <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
            Back to Elsa Collab
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorRegister;
