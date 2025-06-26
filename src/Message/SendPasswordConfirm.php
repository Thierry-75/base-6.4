<?php

namespace App\Message;

final class SendPasswordConfirm
{
private string $from;
private $to;
private string $subject;
private string $template;
private array $context;

    /**
     * @param $from
     * @param $to
     * @param $subject
     * @param $template
     * @param $context
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
     * @return string
     */
    public function getFrom(): string
    {
        return $this->from;
    }

    /**
     * @return array
     */
    public function getContext(): array
    {
        return $this->context;
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return $this->template;
    }

    /**
     * @return string
     */
    public function getSubject(): string
    {
        return $this->subject;
    }

    /**
     * @return string
     */
    public function getTo(): string
    {
        return $this->to;
    }
}
