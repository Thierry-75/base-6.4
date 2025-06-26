<?php

namespace App\Message;

final class SendPasswordRequest
{
    private string $from;
    private string $to;
    private string $subject;
    private string $template;
    private array $context;

    /**
     * Undocumented function
     *
     * @param [string] $from
     * @param [string] $to
     * @param [string] $subject
     * @param [string] $template
     * @param [array] $context
     */
    public function __construct($from, $to, $subject, $template, $context)
    {
        $this->from = $from;
        $this->to = $to;
        $this->subject = $subject;
        $this->template = $template;
        $this->context = $context;
    }

    /**
     * Get the value of from
     *
     * @return string
     */
    public function getFrom(): string
    {
        return $this->from;
    }

    /**
     * Get the value of to
     *
     * @return string
     */
    public function getTo(): string
    {
        return $this->to;
    }

    /**
     * Get the value of subject
     *
     * @return string
     */
    public function getSubject(): string
    {
        return $this->subject;
    }

    /**
     * Get the value of template
     *
     * @return string
     */
    public function getTemplate(): string
    {
        return $this->template;
    }

    /**
     * Get the value of context
     *
     * @return array
     */
    public function getContext(): array
    {
        return $this->context;
    }
}
