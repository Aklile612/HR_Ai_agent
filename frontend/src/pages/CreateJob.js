import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { jobsAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Job title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Job description is required');
      return;
    }

    try {
      setLoading(true);
      console.log('Creating job with data:', formData);
      const response = await jobsAPI.create(formData);
      console.log('Job creation response:', response);
      toast.success('Job created successfully!');
      navigate('/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      console.error('Error details:', error.response?.data);

      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          'Failed to create job';

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 border-b border-white/[0.05] pb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/jobs')}
          className="mb-4 -ml-4"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Create New Job</h1>
        <p className="text-zinc-500 font-light mt-2">
          Submit new role requirements to spin up an AI screening pipeline.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Fill out the information below to create a new job listing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-zinc-400 mb-2">
                  Job Title *
                </label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                id="description"
                rows={6}
                required
                value={formData.description}
                onChange={handleChange}
                className="flex w-full rounded-md border border-white/[0.08] bg-[#050505] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:border-white/[0.2] focus-visible:ring-1 focus-visible:ring-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50 transition-colors min-h-[150px] resize-y placeholder:text-zinc-500"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
              />
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-zinc-400 mb-2">
                Requirements
              </label>
              <textarea
                name="requirements"
                id="requirements"
                rows={4}
                value={formData.requirements}
                onChange={handleChange}
                className="flex w-full rounded-md border border-white/[0.08] bg-[#050505] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:border-white/[0.2] focus-visible:ring-1 focus-visible:ring-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50 transition-colors min-h-[100px] resize-y placeholder:text-zinc-500"
                placeholder="List the required skills, experience, and qualifications..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/jobs')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={!formData.title.trim() || !formData.description.trim()}
              >
                {loading ? 'Creating...' : 'Create Job'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
